# Samarth Engineering Works – Parts Tracker

Monorepo: `client/` (React + Vite + Tailwind) and `server/` (Express + MongoDB). See [PLAN.md](PLAN.md) for the design.

## Setup

```bash
npm install
cp server/.env.example server/.env   # then edit JWT_SECRET and ADMIN_* values
npm run seed                          # creates the single admin (needs MongoDB running)
npm run dev                           # API on :5000, web app on :5173
```

Open http://localhost:5173 and sign in with the admin login from `.env`.

## Using it

1. **Admin** → *Add company* → enter name, short code and first member → copy the generated Login ID + password (shown once).
2. Open the company → add projects, then open a project to add parts and change their status.
3. Share the credentials with the client; they sign in and see only their company's projects (read-only).

## Deploy to Vercel

One Vercel project serves the React build (`client/`) and runs the Express API as a service (`server/`), both on the same domain. Routing is defined by `services` in `vercel.json`.

1. Create a free MongoDB Atlas cluster, a database user, and allow network access from `0.0.0.0/0`.
2. Set `MONGO_URI` and `MONGO_DB_NAME` in `server/.env` to the Atlas values and run `npm run seed` once to create the admin. The URI must include the database name (for example `.../mech-shop`) or `MONGO_DB_NAME` must be set, otherwise MongoDB silently writes to a database called `test`.
3. Push the repo to GitHub and import it in Vercel (leave the root directory as is).
4. Add these environment variables in **Project → Settings → Environment Variables** (for Production *and* Preview), then redeploy — changing env vars does not apply to an existing deployment:
   - `MONGO_URI` — full Atlas string **including the database name**, e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/mech-shop?retryWrites=true&w=majority`
   - `MONGO_DB_NAME=mech-shop`
   - `JWT_SECRET` — long random string
   - `JWT_EXPIRES=8h`
   - `CLIENT_ORIGIN` — your deployment URL, e.g. `https://your-app.vercel.app`
5. Deploy. Later pushes to `main` redeploy automatically.

The API connects lazily on the first request and reuses the connection across warm invocations (`server/src/db.js`). A missing/unreachable database now returns `503 {"message":"Database unavailable"}` instead of hanging until Mongoose's 10s buffer timeout.

### Seeding the cloud database

`npm run seed` uses `server/.env`, so it seeds whatever `MONGO_URI` points at. If your local `.env` still points to localhost, run it with the Atlas URI instead:

```powershell
# PowerShell - just for this command
$env:MONGO_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/mech-shop"
$env:MONGO_DB_NAME="mech-shop"
npm run seed
```

The seed script prints the database it connected to, so you can confirm it is not `test`.

### Upgrading from the older `api/index.js` setup

Vercel's Express preset loads `server/src/app.js` directly, so the connection code that used to live in `server/src/index.js` never ran in production. The connection is now established from `app.js`, which works both for `npm start` and Vercel.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | server (watch mode) + client together |
| `npm run seed` | create the admin if none exists |
| `npm run build` | production build of the client into `client/dist` |
| `npm start` | run the API (set `NODE_ENV=production`) |
