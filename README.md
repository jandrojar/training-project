# Training Project

Full-stack app: **Backend** (Node 20 + TypeScript + Koa + Prisma + PostgreSQL) and **Frontend** (Vue 3 + Vite + Tailwind). The repo now ships two clean Docker Compose setups (dev & prod) plus instructions to run everything without Docker.

Key Prisma note: the datasource URL is read from `prisma.config.ts` (Prisma 5/7 style), **not** from `schema.prisma`.

---

## Requirements
- Docker & Docker Compose (for containerized workflows)
- Node.js 20 + npm (for running without Docker)

---

## Environment Variables
Samples are provided; copy and adjust as needed.

- Backend (local dev): `backend/.env.example` → `backend/.env`
- Backend (prod/local or Compose prod): `backend/.env.production.example` → `backend/.env.production`
- Frontend (local dev): `frontend/.env.example` → `frontend/.env.development` (or set `VITE_API_URL` inline)

---

## Run with Docker (Development)
Hot-reload for frontend + backend, Postgres exposed on host `5433`.

```bash
docker compose up --build
# or: docker compose up --build -d   # run in background
```

What happens:
- Backend installs deps if needed, waits for Postgres, runs `prisma migrate deploy`, then starts on `:3000`.
- Frontend starts Vite dev server on `:5173`.

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: host `localhost:5433` (user/pass: `postgres` / `postgres`, db: `training_db`)

Useful commands:
```bash
docker compose logs -f backend
docker compose exec backend npx prisma studio
docker compose down          # stop containers
docker compose down -v       # stop and drop dev DB volume
```

---

## Run with Docker (Production-style)
Creates optimized images and serves frontend via nginx proxying `/api` to the backend.

1) Prepare env file: `cp backend/.env.production.example backend/.env.production` and edit values (DB password, CORS origin, etc).
2) Build & start:
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

What happens:
- Backend image is built once (Prisma client generated during build).
- At runtime, backend waits for DB, runs `prisma migrate deploy`, then serves on the internal network.
- Frontend served on http://localhost (port 80 by default).

Stop:
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml down -v   # also remove DB data
```

---

## Run without Docker
### Database
Ensure PostgreSQL is running and reachable; create `training_db` (or adjust `DATABASE_URL`).

### Backend (development)
```bash
cd backend
cp .env.example .env   # adjust if needed
npm ci
npx prisma migrate dev
npm run dev
```

### Backend (production-ish local run)
```bash
cd backend
cp .env.production.example .env.production   # adjust values
npm ci --omit=dev
npx prisma migrate deploy
npm run build
npm run start
```

### Frontend (development)
```bash
cd frontend
cp .env.example .env.development   # or export VITE_API_URL
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```

### Frontend (production build)
```bash
cd frontend
VITE_API_URL=/api npm run build    # or set the URL you want baked into the bundle
# serve ./dist with any static server or nginx that proxies /api to the backend
```

---

## File Map (Docker-related)
- Dev compose: `docker-compose.yml`
- Prod compose: `docker-compose.prod.yml`
- Backend Dockerfiles: `backend/Dockerfile` (prod), `backend/Dockerfile.dev` (dev)
- Frontend Dockerfiles: `frontend/Dockerfile` (prod), `frontend/Dockerfile.dev` (dev)
- Entrypoints: `backend/entrypoint.sh` (prod), `backend/entrypoint.dev.sh` (dev), `frontend/entrypoint.dev.sh`

---

## Notes & Troubleshooting
- Prisma uses `DATABASE_URL` from `prisma.config.ts`; ensure it matches your DB before running any `prisma` command.
- Dev containers auto-run `prisma migrate deploy`; if you add a new migration, rebuild or re-run the backend container.
- If ports are busy, override with `PORT=3001 VITE_API_URL=http://localhost:3001` in compose overrides or env files.
- For a clean slate in dev, run `docker compose down -v` to drop the Postgres volume.
- If you change dependencies and something feels stale, rebuild and clear the `backend_node_modules` / `frontend_node_modules` volumes (`docker compose down -v`) before starting again.
