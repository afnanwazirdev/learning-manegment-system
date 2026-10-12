import express from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import { fileURLToPath } from 'url';
import { ACC, F, LK, M } from '../src/data/config.js'; import { seed } from '../src/data/seed.js'; import { make } from '../src/data/provision.js'; import { renameIn } from '../src/data/rename.js'; import { REG, EDITABLE, digits, validateReg, validateEdit } from '../src/data/fields.js';
const here = path.dirname(fileURLToPath(import.meta.url)), DATA = process.env.DATA_DIR || path.join(here, 'data'), FILE = path.join(DATA, 'db.json');
fs.mkdirSync(DATA, { recursive: true });
let S = null; try { S = JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { }
S = S || { secret: crypto.randomBytes(32).toString('hex'), db: seed(), accounts: [], activity: [], settings: { school: 'EduNest School', accent: '#4f46e5' }, counters: {} };
S.db = { ...seed(), ...S.db }; S.db.admins = S.db.admins || []; S.counters = S.counters || {};
const uid = () => crypto.randomBytes(6).toString('hex'), PRIVATE = ['hash', 'codeHash'], COLL = { student: 'students', teacher: 'teachers', admin: 'admins' };
const toUser = a => Object.fromEntries(Object.entries(a).filter(([k]) => !PRIVATE.includes(k)));
const nextId = role => { const n = S.counters[role] = (S.counters[role] || 0) + 1; return ({ student: 'STU', teacher: 'TCH', admin: 'ADM' }[role]) + '-' + new Date().getFullYear() + '-' + String(n).padStart(4, '0') };
['students', 'teachers'].forEach(c => S.db[c].forEach(r => { if (!r.idNo) r.idNo = nextId(c == 'students' ? 'student' : 'teacher') }));
const save = () => { const j = JSON.stringify(S); try { fs.writeFileSync(FILE + '.tmp', j); fs.renameSync(FILE + '.tmp', FILE) } catch { try { fs.writeFileSync(FILE, j) } catch (e) { console.error('Could not save data:', e.message) } } }; save();
const bad = (res, c, m) => res.status(c).json({ error: m }), sign = a => jwt.sign({ id: a.id }, S.secret, { expiresIn: '7d' });
const personFrom = a => ({
    id: 'p' + a.id, name: a.name, email: a.email, phone: a.mobile, idNo: a.idNo, gender: a.gender, dob: a.dob, address: a.address, avatar: a.avatar || '', joined: a.joined,
    ...(a.role == 'student' ? { class: a.class, roll: S.db.students.length + 1, status: 'Active', guardian: a.guardian, guardianMobile: a.guardianMobile, bloodGroup: a.bloodGroup || '' } : {}),
    ...(a.role == 'teacher' ? { subject: a.subject, classes: a.classes, qualification: a.qualification, experience: a.experience } : {}), ...(a.role == 'admin' ? { designation: a.designation } : {})
});
const single = c => (M[c]?.[0] || c).replace(/s$/, '').toLowerCase(), title = r => r.title || r.name || r.exam || r.assignment || r.month || r.type || r.subject || '';
const PERSONAL = ['attendance', 'exams', 'fees', 'submissions', 'leaves', 'messages'], CLASSY = ['assignments', 'lessons', 'materials', 'timetable'];
function visOf(c, r) {
    if (c == 'announcements') return { roles: r.audience == 'All' ? ['admin', 'teacher', 'student'] : r.audience == 'Teachers' ? ['admin', 'teacher'] : ['admin', 'student'] };
    if (PERSONAL.includes(c)) return { names: [r.student, r.who, r.to, r.from, r.teacher].filter(Boolean) }; if (CLASSY.includes(c) && r.class) return { classes: [r.class], roles: ['admin'] };
    if (['students', 'teachers', 'admins'].includes(c)) return { roles: ['admin'] }; return { roles: ['admin', 'teacher', 'student'] }
}
const log = (u, verb, c, r, extra = {}) => { S.activity.push({ id: uid(), ts: Date.now(), actor: u.name, role: u.role, coll: c, verb, text: `${u.name} ${verb} ${single(c)}${title(r) ? ': ' + title(r) : ''}`, vis: visOf(c, r), ...extra }); if (S.activity.length > 600) S.activity.splice(0, S.activity.length - 600) };
const canSee = (e, u) => u.role == 'admin' || (e.vis.roles?.includes(u.role) && !e.vis.names && !e.vis.classes) || !!e.vis.names?.includes(u.name) || (!!e.vis.classes && (u.role == 'student' ? e.vis.classes.includes(u.class) : u.role == 'teacher' && e.vis.classes.some(c => (u.classes || '').includes(c))));
const visible = (c, r, u) => {
    if (c == 'submissions' && u.role != 'admin') {
        const student = S.db.students.find(s => s.name == r.student);
        const assignment = S.db.assignments.find(a => a.title == r.assignment && a.class == student?.class);
        if (!student || !assignment) return false;
        if (u.role == 'student') return student.name == u.name && student.class == u.class;
        if (u.role == 'teacher') return (u.classes || '').split(',').map(s => s.trim()).includes(student.class);
    }
    const f = (F[u.role] || {})[c]; return !f || f(r, u)
};
function clean(c, body, u, existing) {
    const out = {}; for (const [k, l, t, adm] of M[c][2]) {
        if (t == 'f') continue; if (adm && u.role != 'admin') { if (!existing) out[k] = t[0]; continue }
        if (!(k in body)) { if (existing) continue; return { error: `${l} is required.` } } let v = body[k]; v = typeof v == 'string' ? v.trim() : v; if (v === '' || v == null) return { error: `${l} is required.` };
        if (t == 'n') { v = Number(v); if (!Number.isFinite(v) || v < 0) return { error: `${l} must be a number of 0 or more.` } }
        else if (t == 'e' && !/^\S+@\S+\.\S+$/.test(v)) return { error: `${l} must be a valid email.` }; else if (Array.isArray(t) && !t.includes(v)) return { error: `${l} has an invalid value.` };
        else if (t == 'd' && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { error: `${l} must be a date.` }; else if (typeof v == 'string' && v.length > 2000) return { error: `${l} is too long.` }; out[k] = v
    } return { out }
}
const locked = (c, u) => LK[c] && (c == 'messages' || c == 'leaves' || u.role == 'student');
const app = express(); app.use(express.json({ limit: '1mb' }));
const auth = (req, res, next) => { try { const { id } = jwt.verify((req.headers.authorization || '').slice(7), S.secret), a = S.accounts.find(x => x.id == id); if (!a) throw 0; req.acc = a; req.user = toUser(a); next() } catch { bad(res, 401, 'Please sign in again.') } };
app.get('/api/health', (q, r) => r.json({ ok: true, school: S.settings.school }));
app.post('/api/register', async (req, res) => {
    const b = req.body || {}, role = b.role; if (!COLL[role]) return bad(res, 400, 'Choose a valid portal.');
    const er = validateReg(role, b); if (er) return bad(res, 400, er); const email = b.email.trim().toLowerCase(), pw = String(b.password || '');
    if (pw.length < 8) return bad(res, 400, 'Password must be at least 8 characters.');
    if (S.accounts.some(a => a.role == role && a.email == email)) return bad(res, 409, 'An account with this email already exists in this portal. Sign in instead.');
    if (S.accounts.some(a => a.role == role && digits(a.mobile) == digits(b.mobile))) return bad(res, 409, 'This mobile number is already registered in this portal.');
    let codeHash; if (role == 'admin') {
        const first = S.accounts.find(a => a.role == 'admin'), code = String(b.code || '');
        if (first) { if (!(await bcrypt.compare(code, first.codeHash))) return bad(res, 403, 'The admin access code is incorrect.') } else { if (code.length < 6) return bad(res, 400, 'Create an admin access code of at least 6 characters.'); codeHash = await bcrypt.hash(code, 10) }
    }
    const acc = { id: uid(), role, email, joined: new Date().toISOString().slice(0, 10), idNo: nextId(role), hash: await bcrypt.hash(pw, 10) }; if (codeHash) acc.codeHash = codeHash;
    for (const [k] of [...REG.common, ...REG[role]]) if (k != 'email') acc[k] = typeof b[k] == 'string' ? b[k].trim() : b[k];
    S.accounts.push(acc); S.db[COLL[role]].push(personFrom(acc)); if (role != 'admin') { const o = make(role, toUser(acc), S.db); if (o) Object.assign(S.db, o) }
    log(toUser(acc), 'joined as ' + role, COLL[role], acc, { text: `${acc.name} joined as a new ${role}` }); save(); res.json({ token: sign(acc), user: toUser(acc) })
});
const tries = {};
app.post('/api/login', async (req, res) => {
    const { role, email, password } = req.body || {}, key = (req.ip || '') + String(email).toLowerCase(); let t = tries[key] || { n: 0, ts: Date.now() }; if (Date.now() - t.ts > 6e5) t = { n: 0, ts: Date.now() };
    if (t.n >= 8) return bad(res, 429, 'Too many attempts. Please wait 10 minutes and try again.'); const a = S.accounts.find(x => x.role == role && x.email == String(email || '').trim().toLowerCase());
    const em = String(email || '').trim().toLowerCase(), cap = x => x[0].toUpperCase() + x.slice(1);
    if (!a) { t.n++; tries[key] = t; const o = S.accounts.find(x => x.email == em); return bad(res, 401, o ? `This email is registered in the ${cap(o.role)} portal. Go back and choose ${cap(o.role)}.` : `No ${role} account found for this email. New here? Click Register to create one.`) }
    if (!(await bcrypt.compare(String(password || ''), a.hash))) { t.n++; tries[key] = t; return bad(res, 401, 'Incorrect password. Please try again.') }
    delete tries[key]; res.json({ token: sign(a), user: toUser(a) })
});
app.get('/api/bootstrap', auth, (req, res) => { const u = req.user, db = {}; for (const c of Object.keys(S.db)) { if (c == 'prov' || (u.role != 'admin' && !ACC[u.role][c])) continue; db[c] = S.db[c].filter(r => visible(c, r, u)) } res.json({ user: u, db, settings: S.settings, people: S.accounts.filter(a => a.id !== u.id && (u.role != 'student' || a.role != 'student')).map(a => ({ name: a.name, role: a.role })) }) });
app.post('/api/data/:c', auth, (req, res) => {
    const { c } = req.params, u = req.user; if (!M[c]?.[2] || !S.db[c] || (ACC[u.role][c] !== 'w' && !(c == 'submissions' && u.role == 'student'))) return bad(res, 403, 'You do not have permission to do that.');
    const r = clean(c, req.body || {}, u); if (r.error) return bad(res, 400, r.error); if (locked(c, u)) r.out[LK[c]] = u.name; const row = { id: uid(), ...r.out };
    if (c == 'submissions' && u.role == 'student') { row.score = 0; row.status = 'Submitted' }
    if (c == 'students' || c == 'teachers') row.idNo = nextId(c == 'students' ? 'student' : 'teacher'); if (!visible(c, row, u)) return bad(res, 403, 'That record is outside your classes.');
    if (c == 'messages' && !S.accounts.some(a => a.name == row.to && a.id !== u.id && (u.role != 'student' || a.role != 'student'))) return bad(res, 400, 'Choose a recipient from the list.');
    if (c == 'submissions' && u.role == 'student' && S.db.submissions.some(x => x.student == u.name && x.assignment == row.assignment)) return bad(res, 409, 'You already submitted this assignment.');
    S.db[c].push(row); log(u, 'added', c, row); save(); res.json(row)
});
app.put('/api/data/:c/:id', auth, (req, res) => {
    const { c, id } = req.params, u = req.user; if (!M[c]?.[2] || !S.db[c] || ACC[u.role][c] !== 'w') return bad(res, 403, 'You do not have permission to do that.');
    let row = S.db[c].find(x => x.id == id); if (!row || !visible(c, row, u)) return bad(res, 404, 'Record not found.'); const r = clean(c, req.body || {}, u, row); if (r.error) return bad(res, 400, r.error);
    if (locked(c, u)) delete r.out[LK[c]]; if (!visible(c, { ...row, ...r.out }, u)) return bad(res, 403, 'That record is outside your classes.');
    if ((c == 'students' || c == 'teachers') && r.out.name && r.out.name !== row.name) { const old = row.name; S.db = renameIn(S.db, old, r.out.name); S.accounts.forEach(a => { if (a.email == row.email && a.name == old) a.name = r.out.name }); row = S.db[c].find(x => x.id == id) }
    Object.assign(row, r.out); log(u, 'updated', c, row); save(); res.json(row)
});
app.delete('/api/data/:c/:id', auth, (req, res) => {
    const { c, id } = req.params, u = req.user; if (!M[c]?.[2] || !S.db[c] || ACC[u.role][c] !== 'w') return bad(res, 403, 'You do not have permission to do that.');
    const row = S.db[c].find(x => x.id == id); if (!row || !visible(c, row, u)) return bad(res, 404, 'Record not found.'); S.db[c] = S.db[c].filter(x => x.id != id);
    if (c == 'students' || c == 'teachers') S.accounts = S.accounts.filter(a => !(a.email == row.email && a.role == (c == 'students' ? 'student' : 'teacher'))); log(u, 'deleted', c, row); save(); res.json({ ok: true })
});
app.post('/api/attendance/bulk', auth, (req, res) => {
    const u = req.user; if (u.role == 'student') return bad(res, 403, 'You do not have permission to do that.'); const { date, class: cls, records } = req.body || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !cls || !Array.isArray(records)) return bad(res, 400, 'Choose a class and a date.');
    if (u.role == 'teacher' && !(u.classes || '').split(',').map(s => s.trim()).includes(cls)) return bad(res, 403, 'You can only mark attendance for your own classes.');
    const roster = new Set(S.db.students.filter(s => s.class == cls).map(s => s.name)), recs = records.filter(r => roster.has(r.student) && ['Present', 'Absent', 'Late'].includes(r.status));
    S.db.attendance = S.db.attendance.filter(a => !(a.date == date && a.class == cls && recs.some(r => r.student == a.student))); recs.forEach(r => S.db.attendance.push({ id: uid(), date, student: r.student, class: cls, status: r.status }));
    log(u, 'marked', 'attendance', { class: cls }, { text: `${u.name} marked attendance for ${cls} (${recs.length} students, ${recs.filter(r => r.status == 'Absent').length} absent)`, vis: { classes: [cls], roles: ['admin'] } }); save(); res.json({ saved: recs.length })
});
app.put('/api/profile', auth, (req, res) => {
    const a = req.acc, b = req.body || {}; let er = validateEdit(a.role, b); if (!er && 'avatar' in b && (typeof b.avatar != 'string' || b.avatar.length > 400000)) er = 'That photo is too large.'; if (er) return bad(res, 400, er);
    const old = a.name; for (const k of Object.keys(b)) a[k] = typeof b[k] == 'string' ? b[k].trim() : b[k]; if (a.name !== old) S.db = renameIn(S.db, old, a.name);
    const p = S.db[COLL[a.role]].find(x => x.email == a.email); if (p) { Object.assign(p, { name: a.name, phone: a.mobile, avatar: a.avatar || '', gender: a.gender, dob: a.dob, address: a.address }); for (const k of ['guardian', 'guardianMobile', 'bloodGroup', 'qualification', 'experience', 'designation']) if (k in b) p[k] = a[k] }
    log(toUser(a), 'updated their profile', COLL[a.role], {}, { text: `${a.name} updated their profile`, vis: { roles: ['admin'] } }); save(); res.json({ user: toUser(a) })
});
app.post('/api/password', auth, async (req, res) => {
    const { current, next } = req.body || {}; if (!(await bcrypt.compare(String(current || ''), req.acc.hash))) return bad(res, 400, 'Current password is incorrect.');
    if (String(next || '').length < 8) return bad(res, 400, 'New password must be at least 8 characters.'); req.acc.hash = await bcrypt.hash(String(next), 10); save(); res.json({ ok: true })
});
app.put('/api/settings', auth, (req, res) => {
    if (req.user.role != 'admin') return bad(res, 403, 'Only admins can change settings.'); const { school, accent } = req.body || {};
    if (typeof school != 'string' || school.trim().length < 2 || school.length > 60) return bad(res, 400, 'School name must be 2 to 60 characters.'); if (!/^#[0-9a-f]{6}$/i.test(accent || '')) return bad(res, 400, 'Choose a valid brand colour.');
    S.settings = { school: school.trim(), accent }; log(req.user, 'updated', 'settings', {}, { text: `${req.user.name} updated the school settings`, vis: { roles: ['admin'] } }); save(); res.json(S.settings)
});
app.get('/api/activity', auth, (req, res) => res.json(S.activity.filter(e => canSee(e, req.user)).slice(-60).reverse().map(({ vis, ...e }) => e)));
app.get('/api/export', auth, (req, res) => { if (req.user.role != 'admin') return bad(res, 403, 'Only admins can export data.'); res.setHeader('Content-Disposition', 'attachment; filename=lms-backup.json'); res.json({ exported: new Date().toISOString(), settings: S.settings, db: S.db, accounts: S.accounts.map(toUser) }) });
const DIST = path.join(here, '..', 'dist'); if (fs.existsSync(DIST)) { app.use(express.static(DIST)); app.get('*', (q, s) => s.sendFile(path.join(DIST, 'index.html'))) }
app.use((e, q, s, n) => bad(s, e.type == 'entity.parse.failed' ? 400 : 500, e.type == 'entity.parse.failed' ? 'Invalid request.' : 'Server error. Please try again.'));
const PORT = process.env.PORT || 5000; app.listen(PORT, () => console.log('EduNest LMS server running on http://localhost:' + PORT)).on('error', e => { console.error(e.code == 'EADDRINUSE' ? `Port ${PORT} is already in use. Close the other program or run with a different port (PORT=4600 npm run server).` : e.message); process.exit(1) });
