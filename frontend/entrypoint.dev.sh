#!/bin/sh
sed -i 's/\r$//' "$0"
set -eu

echo "Ensuring frontend dependencies are installed..."
if [ ! -d node_modules ] || [ ! -f node_modules/.bin/vite ]; then
  npm ci
fi

echo "Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0 --port 5173
