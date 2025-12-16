#!/bin/sh
set -euo pipefail

echo "Ensuring frontend dependencies are installed..."
if [ ! -d node_modules ]; then
  npm ci
fi

echo "Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0 --port 5173
