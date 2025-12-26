#!/bin/sh
sed -i 's/\r$//' "$0"
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required for the backend to start." >&2
  exit 1
fi

echo "Waiting for database to be reachable..."
until node -e "const url=new URL(process.env.DATABASE_URL);const net=require('net');const socket=net.createConnection({host:url.hostname,port:url.port||5432});socket.on('connect',()=>{socket.end();process.exit(0);});socket.on('error',()=>process.exit(1));" >/dev/null 2>&1; do
  echo "Database not ready yet. Retrying in 2s..."
  sleep 2
done

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Starting backend (prod)..."
exec node dist/index.js
