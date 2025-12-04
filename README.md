# Training Project

Full-stack application with Node.js + TypeScript + Koa + Prisma + PostgreSQL on the backend, and Vue 3 + Vite + Tailwind on the frontend. Fully containerized for development and production environments with Docker Compose.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js 20, TypeScript, Koa, Prisma ORM, PostgreSQL |
| **Frontend** | Vue 3, Vite, Tailwind CSS |
| **Infrastructure** | Docker Compose, nginx (reverse proxy in production) |

---

## ⚡ Quick Start (Development with Docker)

No `.env` files needed—everything is configured:

```bash
docker compose up
```

Access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5433 (PostgreSQL)

Stop:
```bash
docker compose down
```

---

## 📋 Environment Variables

**.env files are NOT committed to the repo** (see `.gitignore`). Create them locally before running.

### Development (Local, Without Docker)

Create `backend/.env`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/training_db
CORS_ORIGIN=http://localhost:5173
```

Create `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:3000
```

### Production (With Docker)

Create `backend/.env.production`:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/training_db
CORS_ORIGIN=http://yourdomain.com
NODE_ENV=production
```

**Note**: `CORS_ORIGIN` should match your public domain. In Docker, use the service name (`db`) instead of `localhost`.

---

## 🏃 Running the Application

### Development

#### With Docker (Recommended)
```bash
docker compose up
```
- Hot reload enabled via volume mounts
- Database auto-starts (no `.env` needed)
- All services: http://localhost:5173 (frontend)

#### Without Docker
Requires PostgreSQL running locally.

**Terminal 1 — Backend**:
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend**:
```bash
cd frontend
npm install
npm run dev
```

Access at http://localhost:5173

### Production

#### With Docker (Recommended)

1. Ensure `backend/.env.production` exists (see above)
2. Build and run:
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

- Frontend served by nginx on http://localhost
- Backend accessible via `/api` proxy
- Database and backend isolated in internal network

#### Without Docker

**Backend**:
```bash
cd backend
npm install --omit=dev
npm run build
npm run start
```

**Frontend**:
```bash
cd frontend
npm install
npm run build
```

Serve `frontend/dist` with any static server (nginx, Apache, etc.). Ensure `/api` proxies to your backend or set `VITE_API_URL` before building.

---

## 🗄️ Database & Prisma

**Schema**: `backend/prisma/schema.prisma`

### Local Development

Apply migrations after first setup:
```bash
cd backend
npx prisma migrate dev
```

Or with Docker:
```bash
docker compose exec backend npx prisma migrate dev
```

### Production

Migrations are automatically applied on container startup via `backend/entrypoint.sh` (runs `prisma migrate deploy`).

---

## 📁 Project Structure

```
training-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml (dev)
├── docker-compose.prod.yml
└── README.md
```

---

## 🐳 Docker Commands Reference

```bash
# Development
docker compose up              # Start all services
docker compose down            # Stop and remove containers
docker compose logs -f         # Follow logs

# Production
docker compose -f docker-compose.prod.yml build    # Build images
docker compose -f docker-compose.prod.yml up -d    # Start daemonized
docker compose -f docker-compose.prod.yml down     # Stop and remove
docker compose -f docker-compose.prod.yml logs -f  # Follow logs
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `DATABASE_URL is undefined` | Ensure `.env` file exists and is loaded |
| `ECONNREFUSED` | PostgreSQL not running or wrong host/port |
| `port 5173 already in use` | Change port: `docker compose up -p 5174:5173` or kill process |
| `migration failed` | Check database user/password in `.env` |
| Stale Docker image | Run `docker compose build --no-cache` |

---

## 📝 Notes

- `.env` files are ignored by git (see `.gitignore`)
- For production, use strong passwords and secure `CORS_ORIGIN`
- Frontend prod build is cached by docker—rebuild if assets change
- Backend uses Koa middleware for CORS and request handling
