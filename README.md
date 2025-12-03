# Training Project

Full‑stack app with Koa + Prisma + PostgreSQL and Vue 3 + Vite + Tailwind, dockerized for dev and prod (nginx serving the frontend in prod).

## Tech stack
- Backend: Node.js 20, TypeScript, Koa, Prisma, PostgreSQL
- Frontend: Vue 3, Vite, Tailwind
- Infra: Docker Compose (dev and prod), nginx (reverse proxy in prod)

## Environment variables
- Backend dev: `backend/.env` (sample values already present).
- Backend prod: `backend/.env.production` (Compose prod loads it).
- Frontend dev: `frontend/.env.development` (`VITE_API_URL=http://localhost:3000`).
- Frontend prod: baked at build time via `VITE_API_URL=/api` (set in `docker-compose.prod.yml` build args). If you build without Compose, set `VITE_API_URL=/api` in `frontend/.env.production`.

## Run in development
- With Docker: `docker compose up` (exposes frontend `5173`, backend `3000`, db `5432`). Hot reload via volume mounts.
- Without Docker:
  - Start PostgreSQL and update `backend/.env` `DATABASE_URL` if needed.
  - Backend: `cd backend && npm install && npm run dev`.
  - Frontend: `cd frontend && npm install && npm run dev`.
  - API available at `http://localhost:3000`, frontend at `http://localhost:5173`.

## Run in production
- With Docker: `docker compose -f docker-compose.prod.yml build && docker compose -f docker-compose.prod.yml up -d`.
  - nginx serves the built frontend on `http://localhost` and proxies `/api` to the backend.
  - DB and backend are only reachable inside the Compose network.
- Without Docker:
  - Backend: `cd backend && npm install --only=production && npm run build && npm run start` (requires a reachable Postgres URL).
  - Frontend: `cd frontend && npm install && npm run build` then serve `frontend/dist` with any static server; ensure it proxies `/api` to your backend or set `VITE_API_URL` to the backend URL before building.

## Database and Prisma
- Schema: `backend/prisma/schema.prisma`.
- Apply migrations in prod container: handled by `backend/entrypoint.sh` via `prisma migrate deploy`.
- Local dev: `cd backend && npx prisma migrate dev` (with a running Postgres per `DATABASE_URL`).
