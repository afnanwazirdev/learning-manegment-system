# EduNest School LMS (online website)

Real accounts, saved data and ID cards. React front-end + Node/Express back-end.

## Run on your computer
    npm install
    npm run dev          # site on http://localhost:5173 (API on :4510)

## Run as a live website
    npm install
    npm run build
    npm start            # one server serves the site and the API (PORT env, default 4510)

Deploy to Render / Railway / a VPS: build command `npm install && npm run build`, start command `npm start`.
Data is stored in `server/data/db.json` - keep that folder on a persistent disk (or set DATA_DIR) and back it up (Admin > Settings > Download backup).

## Notes
- Each portal (Admin / Teacher / Student) has its own register + sign-in. Passwords are hashed (bcrypt). The first admin creates an admin access code; later admin sign-ups need it.
- Roles are enforced on the server, not just in the interface.
- New accounts get a little sample data so dashboards are not empty. Seeded demo records (e.g. Ali Raza) can be deleted by the admin.
- JSON-file storage suits a single school; move to a database (MongoDB/PostgreSQL) for large scale.

## If registration or login does not move forward
1. Run `npm install` again after unzipping (new packages were added), then `npm run dev`. The terminal must show both `[api] EduNest LMS server running on http://localhost:4510` and `[web] Local: http://localhost:5173`.
2. If the page shows a red "School server is not connected" box, the API is not running. If it says the port is in use, run `PORT=4600 npm run dev` (Windows PowerShell: `$env:PORT=4600; npm run dev`).
3. Log in from the same portal you registered in. A student account does not work in the Admin or Teacher portal; the login page now tells you which portal an account belongs to.
4. To start completely fresh, stop the server and delete the `server/data` folder.
