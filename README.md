# Training Project

Purpose: a simple full‑stack training app for authentication and managing projects/tasks.

Stack: **Backend** (Node 20, TypeScript, Koa, Prisma, PostgreSQL) and **Frontend** (Vue 3, Vite, Tailwind). Two Compose files are provided (dev + prod) plus instructions to run without Docker.

Prisma reads `DATABASE_URL` from `prisma.config.ts` (Prisma 5/7 style), not from `schema.prisma`.

---

## Requirements
- Docker + Docker Compose (for container workflows)
- Running without Docker: Node.js 20, npm 10, and a PostgreSQL instance you manage (npm does **not** install Postgres for you). `psql` is recommended for quick checks.
- Windows users: use WSL or Git Bash; if using PowerShell, translate `cp`/`export` commands accordingly.

---

## Environment Files
Copy the sample that matches your run mode and edit values (DB password, origins, etc).
- Backend (dev): `backend/.env.example` → `backend/.env`
- Backend (prod/prod-like): `backend/.env.production.example` → `backend/.env.production`
- Frontend (dev): `frontend/.env.example` → `frontend/.env.development` (or export `VITE_API_URL`)

---

## Run with Docker (Development)
Hot reload for frontend + backend. Postgres is exposed on `5433` for local tools.

```bash
docker compose up --build      # add -d to detach
```

What it does:
- DB: postgres:16 on `localhost:5433` (`postgres/postgres`, db `training_db`)
- Backend: installs deps if needed, waits for DB, runs `prisma migrate deploy`, serves `:3000`
- Frontend: Vite dev server on `:5173`

Useful:
```bash
docker compose logs -f backend
docker compose exec backend npx prisma studio
docker compose down            # stop
docker compose down -v         # stop + drop dev DB & node_modules volumes
```

---

## Run with Docker (Production-style)
Builds optimized images; nginx serves the frontend and proxies `/api` to the backend.

```bash
cp backend/.env.production.example backend/.env.production  # edit values
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

What it does:
- Backend image is built once (Prisma client generated during build)
- At runtime: waits for DB, runs `prisma migrate deploy`, then serves inside the Compose network
- Frontend available at http://localhost (port 80)

Shutdown:
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml down -v   # also drop prod DB volume
```

---

## Run without Docker
### Database
Provide a reachable PostgreSQL and create `training_db` (or set `DATABASE_URL` to your DB name). Make sure the DB user has rights to create/alter tables before running migrations.

### Backend (development)
```bash
cd backend
cp .env.example .env
npm ci
npx prisma migrate dev          # applies migrations + creates new ones when schema changes
npm run dev
```

### Backend (local production-ish)
```bash
cd backend
cp .env.production.example .env.production
# Build requires dev deps (tsc), then you can drop them
npm ci
npx prisma migrate deploy       # apply existing migrations only
npm run build
npm prune --omit=dev
npm run start
```

### Frontend (development)
```bash
cd frontend
cp .env.example .env.development   # or export VITE_API_URL
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```

### Frontend (production bundle)
```bash
cd frontend
VITE_API_URL=/api npm run build    # use /api only if you have a reverse proxy
```
If you are NOT using a reverse proxy, build with `VITE_API_URL=http://localhost:3000` and make sure the backend allows CORS from your frontend origin.

Serve the generated `frontend/dist` with any static server. Example:
```bash
cd frontend
npx serve -s dist
```
If you use a static server without a reverse proxy, set `CORS_ORIGIN` on the backend to the exact frontend URL (including port). To avoid changing it every time, start the static server on a fixed port. Example:
```bash
CORS_ORIGIN=http://localhost:5173 npm run start
```

---

## Migrations Cheat Sheet
- **Prisma URL source**: always from `backend/prisma.config.ts` (`DATABASE_URL` env var). Set it before any Prisma command.
- **Dev with Docker**: `docker compose exec backend npx prisma migrate dev --name <name>` to create/apply a new migration. Restart or `docker compose up` to reapply after volume resets.
- **Prod-style Docker**: add migrations locally (they live under `backend/prisma/migrations`), rebuild images, then `docker compose -f docker-compose.prod.yml up -d` (startup runs `prisma migrate deploy`).
- **Without Docker**: `npx prisma migrate dev --name <name>` when developing; `npx prisma migrate deploy` against the target DB when promoting changes.

---

## Session Handling
- **Backend**: sliding expiration configured in `backend/src/config/auth.ts` (`SESSION_TTL_MS`, `RENEW_WINDOW_MS`) and renewed on authenticated requests.
- **Frontend**: global 401 handling in `frontend/src/services/api.ts` clears session and redirects to login; views skip duplicate toasts via `frontend/src/helpers/isHandledError.ts`.

---

## File Map (containers)
- Dev compose: `docker-compose.yml`
- Prod compose: `docker-compose.prod.yml`
- Backend Dockerfiles: `backend/Dockerfile` (prod), `backend/Dockerfile.dev` (dev)
- Frontend Dockerfiles: `frontend/Dockerfile` (prod), `frontend/Dockerfile.dev` (dev)
- Entrypoints: `backend/entrypoint.sh` (prod), `backend/entrypoint.dev.sh` (dev), `frontend/entrypoint.dev.sh`

---

## Notes & Troubleshooting
- If ports are busy, override with envs (e.g., `PORT=3001`, `VITE_API_URL=http://localhost:3001`) in Compose overrides or env files.
- When dependencies or Prisma client feel stale in dev Compose, rebuild and clear the node_modules volumes: `docker compose down -v` then `docker compose up --build`.
- For a clean slate DB in dev: `docker compose down -v`.
