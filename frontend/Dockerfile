# syntax=docker/dockerfile:1
# Multi-stage build. Targets:
#   dev     -> Vite dev server used by docker-compose.override.yml
#   runtime -> nginx serving the built assets + /api proxy (docker-compose.prod.yml)

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Development image (source is bind-mounted over this by compose) ---
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# --- Build the static bundle ---
FROM deps AS build
WORKDIR /app
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Production runtime ---
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
