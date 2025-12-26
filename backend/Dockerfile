# -----------------------------------------------------------------------------
# Build stage
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Avoid Prisma telemetry noise during builds
ENV PRISMA_HIDE_UPDATE_MESSAGE=1
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/training_db
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
# Install all dependencies (dev deps needed for TypeScript build)
RUN npm ci

# Copy only what is needed for Prisma + build first for better cache usage
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build
# Drop dev dependencies before shipping to runtime image
RUN npm prune --omit=dev

# -----------------------------------------------------------------------------
# Runtime stage
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PRISMA_HIDE_UPDATE_MESSAGE=1

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
