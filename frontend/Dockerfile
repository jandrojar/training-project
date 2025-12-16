# ------------------------------------------------------
# Build stage (Node + Vite)
# ------------------------------------------------------
FROM node:20-alpine AS build-stage

WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Optional build-time variable (kept for flexibility)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production-ready frontend
RUN npm run build


# ------------------------------------------------------
# Production stage (Nginx serving static assets + reverse proxy)
# ------------------------------------------------------
FROM nginx:alpine

# Replace default Nginx config with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend assets to Nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose Nginx default port
EXPOSE 80

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
