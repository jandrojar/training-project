#!/bin/sh
# Single entrypoint for both the dev and the runtime image.
# Waiting for the database is handled by compose (depends_on: service_healthy).
set -eu

: "${DATABASE_URL:?DATABASE_URL is required for the backend to start}"

if [ "${NODE_ENV:-production}" = "development" ]; then
  echo "Regenerating Prisma client (dev)..."
  npx prisma generate
fi

echo "Applying database migrations..."
npx prisma migrate deploy

if [ "${NODE_ENV:-production}" = "development" ]; then
  echo "Starting backend (dev, hot reload)..."
  exec npm run dev
else
  echo "Starting backend (production)..."
  exec node dist/index.js
fi
