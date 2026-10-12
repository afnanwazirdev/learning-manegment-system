# EduNest School LMS

EduNest is a Next.js application that serves the React frontend and its API from the same Vercel deployment. The API stores school records in MongoDB.

## Run locally

1. Create a MongoDB database (MongoDB Atlas is recommended) and copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, and `INITIAL_ADMIN_CODE` in `.env.local`.
3. Install and start the app:

   ```sh
   npm install
   npm run dev
   ```

   Next.js serves the site and `/api/*` routes on `http://localhost:3000`.

## Deploy to Vercel

1. Push this repository to GitHub and import it into Vercel. Use the repository root as the project root; Vercel detects Next.js automatically.
2. Create a MongoDB Atlas database and a database user with access to that database. Configure Atlas network access to allow the Vercel deployment to connect.
3. In Vercel Project Settings > Environment Variables, add:
   - `MONGODB_URI`: the Atlas connection string, including the database user's credentials.
   - `MONGODB_DB`: the database name, for example `edunest`.
   - `JWT_SECRET`: a long, random secret used to sign login tokens.
   - `INITIAL_ADMIN_CODE`: a private code of at least 8 characters for the first administrator account.
4. Add the variables to the environments you will deploy (Production, and Preview if needed), then redeploy.

Vercel uses `npm run build`; its Next.js runtime serves both the frontend and API. Do not deploy only the static frontend. Keep the MongoDB URI, JWT secret, and admin setup code private. After the first admin registers, later admin registrations must use that administrator's access code.

The database is initialized with demo school records the first time it is used. Existing data in an old `server/data/db.json` file is not imported automatically; export and migrate it separately if you need to preserve it.

## Notes

- Admin, teacher, and student authorization is checked by the API.
- Passwords and admin access codes are stored as bcrypt hashes.
- Vercel's filesystem is ephemeral; MongoDB is the persistent store.
