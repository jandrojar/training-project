# syntax=docker/dockerfile:1
# Multi-stage build. Targets:
#   dev     -> hot-reload container used by docker-compose.override.yml
#   runtime -> minimal production image used by docker-compose.prod.yml

FROM node:20-alpine AS base
WORKDIR /app
ENV PRISMA_HIDE_UPDATE_MESSAGE=1
COPY package*.json ./

# --- Full dependency install (dev deps needed for tsc / ts-node-dev / prisma) ---
FROM base AS deps
RUN npm ci

# --- Development image (source is bind-mounted over this by compose) ---
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["sh", "docker/entrypoint.sh"]

# --- Compile TypeScript, then drop dev dependencies ---
FROM deps AS build
COPY . .
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev

# --- Production runtime ---
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY docker/entrypoint.sh ./docker/entrypoint.sh
EXPOSE 3000
CMD ["sh", "docker/entrypoint.sh"]
