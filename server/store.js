import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import { MongoClient } from 'mongodb';
import { seed } from '../src/data/seed.js';

const context = new AsyncLocalStorage();
const clientPromiseKey = Symbol.for('edunest.mongo.client');

function getClient() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  if (!globalThis[clientPromiseKey]) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    globalThis[clientPromiseKey] = client.connect().catch(error => {
      globalThis[clientPromiseKey] = undefined;
      return client.close().then(() => { throw error });
    });
  }
  return globalThis[clientPromiseKey];
}

async function getDatabase() {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || 'edunest');
}

function clone(value) {
  return structuredClone(value);
}

async function initialize(database) {
  const meta = database.collection('lms_meta');
  let state = await meta.findOne({ _id: 'state' });
  if (!state) {
    const initial = {
      _id: 'state',
      secret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
      settings: { school: 'EduNest School', accent: '#4f46e5' },
      counters: {},
      prov: [],
      initialized: false
    };
    try {
      await meta.insertOne(initial);
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
    state = await meta.findOne({ _id: 'state' });
  }
  if (state.initialized) return;

  const records = database.collection('lms_records');
  await Promise.all([
    database.collection('lms_accounts').createIndex({ role: 1, email: 1 }, { unique: true }),
    records.createIndex({ collection: 1 }),
    database.collection('lms_activity').createIndex({ ts: 1 })
  ]);
  const initialDb = seed();
  const counters = { student: 0, teacher: 0 };
  for (const collection of ['students', 'teachers']) {
    const role = collection === 'students' ? 'student' : 'teacher';
    for (const row of initialDb[collection]) {
      if (!row.idNo) {
        counters[role] += 1;
        row.idNo = `${role === 'student' ? 'STU' : 'TCH'}-${new Date().getFullYear()}-${String(counters[role]).padStart(4, '0')}`;
      }
    }
  }
  const operations = Object.entries(initialDb).flatMap(([collection, rows]) =>
    collection === 'prov' || !Array.isArray(rows) ? [] : rows.map(row => ({
      updateOne: {
        filter: { _id: `${collection}:${row.id}` },
        update: { $setOnInsert: { collection, row } },
        upsert: true
      }
    }))
  );
  if (operations.length) {
    try {
      await records.bulkWrite(operations, { ordered: false });
    } catch (error) {
      const duplicateOnly = error.code === 11000 || error.writeErrors?.every(item => item.code === 11000);
      if (!duplicateOnly) throw error;
    }
  }
  await meta.updateOne(
    { _id: 'state', initialized: false },
    { $set: { initialized: true, counters } }
  );
}

async function loadState() {
  const database = await getDatabase();
  await initialize(database);
  const meta = await database.collection('lms_meta').findOne({ _id: 'state' });
  const keys = Object.keys(seed()).filter(key => key !== 'prov');
  const db = Object.fromEntries(keys.map(key => [key, []]));
  db.admins = [];
  const documents = await database.collection('lms_records').find({}).toArray();
  for (const document of documents) {
    if (db[document.collection]) db[document.collection].push(document.row);
  }
  db.prov = meta.prov || [];
  const accounts = (await database.collection('lms_accounts').find({}).toArray()).map(document => document.account);
  const activity = (await database.collection('lms_activity').find({}).toArray())
    .map(document => document.entry)
    .sort((a, b) => a.ts - b.ts)
    .slice(-600);
  return {
    database,
    state: {
      secret: process.env.JWT_SECRET || meta.secret,
      db,
      accounts,
      activity,
      settings: meta.settings || { school: 'EduNest School', accent: '#4f46e5' },
      counters: meta.counters || {}
    }
  };
}

function mapById(rows) {
  return new Map(rows.map(row => [String(row.id), row]));
}

function changed(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

async function persistCollection(collection, prefix, before, after, wrap) {
  const prior = mapById(before || []);
  const current = mapById(after || []);
  const operations = [];
  for (const [id, row] of current) {
    if (!prior.has(id) || changed(prior.get(id), row)) {
      operations.push({
        replaceOne: {
          filter: { _id: `${prefix}${id}` },
          replacement: { _id: `${prefix}${id}`, [wrap]: row },
          upsert: true
        }
      });
    }
  }
  if (operations.length) await collection.bulkWrite(operations);
  const removed = [...prior.keys()].filter(id => !current.has(id));
  if (removed.length) {
    await collection.deleteMany({ _id: { $in: removed.map(id => `${prefix}${id}`) } });
  }
}

async function persistState(database, current, previous) {
  const records = database.collection('lms_records');
  for (const collection of new Set([...Object.keys(previous.db), ...Object.keys(current.db)])) {
    if (collection === 'prov') continue;
    if (!changed(previous.db[collection], current.db[collection])) continue;
    await persistCollection(
      records,
      `${collection}:`,
      previous.db[collection],
      current.db[collection],
      'row'
    );
  }
  if (changed(previous.accounts, current.accounts)) {
    await persistCollection(
      database.collection('lms_accounts'),
      '',
      previous.accounts,
      current.accounts,
      'account'
    );
  }
  if (changed(previous.activity, current.activity)) {
    await persistCollection(
      database.collection('lms_activity'),
      '',
      previous.activity,
      current.activity,
      'entry'
    );
  }
  const metaChanges = {};
  if (current.settings !== previous.settings && changed(previous.settings, current.settings)) metaChanges.settings = current.settings;
  if (changed(previous.db.prov, current.db.prov)) metaChanges.prov = current.db.prov || [];
  if (Object.keys(metaChanges).length) {
    await database.collection('lms_meta').updateOne(
      { _id: 'state' },
      { $set: metaChanges }
    );
  }
}

export const S = new Proxy({}, {
  get(_target, key) {
    const store = context.getStore();
    if (!store) throw new Error('Request state is unavailable.');
    return store.state[key];
  },
  set(_target, key, value) {
    const store = context.getStore();
    if (!store) throw new Error('Request state is unavailable.');
    store.state[key] = value;
    return true;
  }
});

export async function requestState(_req, _res, next) {
  try {
    const { database, state } = await loadState();
    const store = { database, state, original: clone(state) };
    context.run(store, next);
  } catch (error) {
    error.databaseUnavailable = true;
    next(error);
  }
}

export async function nextId(role) {
  const database = context.getStore()?.database || await getDatabase();
  const result = await database.collection('lms_meta').findOneAndUpdate(
    { _id: 'state' },
    { $inc: { [`counters.${role}`]: 1 } },
    { returnDocument: 'after', includeResultMetadata: false }
  );
  const count = result.counters[role];
  const prefix = { student: 'STU', teacher: 'TCH', admin: 'ADM' }[role];
  return `${prefix}-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
}

export async function save() {
  const store = context.getStore();
  if (!store) throw new Error('Request state is unavailable.');
  await persistState(store.database, store.state, store.original);
  store.original = clone(store.state);
}
