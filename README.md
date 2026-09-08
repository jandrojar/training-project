# Training Project

A small full-stack training app for authentication and managing projects/tasks.

**Stack**

- **Backend** — Node 20, TypeScript, Koa, Prisma, PostgreSQL
- **Frontend** — Vue 3, Vite, Tailwind

Prisma reads `DATABASE_URL` from `backend/prisma.config.ts` (env var), not from
`schema.prisma`. Set it before running any Prisma command outside Docker.

---

## Requirements

- **With Docker**: Docker + Docker Compose v2.
- **Without Docker**: Node.js 20, npm 10, and a PostgreSQL instance you manage
  (`psql` recommended for quick checks).
- Windows: use WSL or Git Bash.

---

## Run with Docker

Compose is split into three files following the standard base + override pattern:

| File                          | Purpose                                                   |
| ----------------------------- | -------------------------------------------------------- |
| `docker-compose.yml`          | Base: services, network, DB volume and healthcheck       |
| `docker-compose.override.yml` | Development (applied automatically by `docker compose`)  |
| `docker-compose.prod.yml`     | Production-style (nginx + built images)                   |

Each service has **one multi-stage `Dockerfile`** with `dev` and `runtime` targets.
The single entrypoint (`backend/docker/entrypoint.sh`) only runs migrations and
starts the server — the database wait is handled by Compose (`service_healthy`).

### Development

Hot reload for backend and frontend. Postgres is exposed on `5433` for local tools.

```bash
docker compose up --build          # add -d to detach
```

- DB: `postgres:16` on `localhost:5433` (`postgres` / `postgres`, db `training_db`)
- Backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

Useful:

```bash
docker compose logs -f backend
docker compose exec backend npx prisma studio
docker compose down                # stop
docker compose down -v             # stop + drop the dev DB and node_modules volumes
```

### Production-style

Builds optimized images; nginx serves the frontend and proxies `/api` to the
backend. Neither the database nor the backend is published to the host.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

- Frontend: `http://localhost` (port 80)

Shutdown:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v   # also drop the DB volume
```

---

## Run without Docker

### Database

Provide a reachable PostgreSQL and create `training_db` (or point `DATABASE_URL`
at your own DB). The DB user must be able to create/alter tables.

### Backend

```bash
cd backend
cp .env.example .env               # edit DATABASE_URL etc.
npm ci
npx prisma migrate dev             # applies migrations (and creates new ones on schema changes)
npm run dev
```

Production build:

```bash
npm ci
npx prisma migrate deploy          # apply existing migrations only
npm run build
npm run start
```

### Frontend

```bash
cd frontend
cp .env.example .env.development    # or export VITE_API_URL
npm ci
npm run dev
```

Production bundle:

```bash
VITE_API_URL=/api npm run build     # use /api only behind a reverse proxy;
                                    # otherwise VITE_API_URL=http://localhost:3000
```

Serve `frontend/dist` with any static server (`npx serve -s dist`). Without a
reverse proxy, set `CORS_ORIGIN` on the backend to the exact frontend origin.

---

## Migrations cheat sheet

- **URL source**: `backend/prisma.config.ts` (`DATABASE_URL`). Set it before any Prisma command.
- **Dev with Docker**: `docker compose exec backend npx prisma migrate dev --name <name>`.
- **Prod-style Docker**: add the migration locally (`npx prisma migrate dev --name <name>`
  against a dev DB), rebuild images; startup runs `prisma migrate deploy`.
- **Without Docker**: `npx prisma migrate dev` while developing; `npx prisma migrate deploy`
  when promoting to another database.

---

## Code style

Prettier + ESLint are configured per package. Before committing:

```bash
cd backend   && npm run lint && npm run format
cd ../frontend && npm run lint && npm run format
```

The bulk-format commit is listed in `.git-blame-ignore-revs`; enable it locally with
`git config blame.ignoreRevsFile .git-blame-ignore-revs`.

---

## Session handling

- **Backend**: sliding expiration in `backend/src/config/auth.ts` (`SESSION_TTL_MS`,
  `RENEW_WINDOW_MS`), renewed on authenticated requests.
- **Frontend**: global 401 handling in `frontend/src/services/api.ts` clears the
  session and redirects to login; `frontend/src/helpers/isHandledError.ts` prevents
  duplicate toasts.

---

## Container file map

- Compose: `docker-compose.yml`, `docker-compose.override.yml` (dev), `docker-compose.prod.yml`
- Backend: `backend/Dockerfile` (targets `dev` / `build` / `runtime`), `backend/docker/entrypoint.sh`
- Frontend: `frontend/Dockerfile` (targets `dev` / `build` / `runtime`), `frontend/nginx.conf`

---

## Troubleshooting

- **Ports busy**: override with env (`FRONT_PORT`, or edit the compose port mappings).
- **Stale deps / Prisma client in dev**: `docker compose down -v && docker compose up --build`.
- **Clean DB in dev**: `docker compose down -v`.
