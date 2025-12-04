# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first (to leverage Docker cache)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the full application code
COPY . .

# Set environment variables for production
ENV NODE_ENV=production

# Expose the port used by the Koa API
EXPOSE 3000

# Build TypeScript before starting (needed in production images)
RUN npm run build

# Start the server
CMD ["npm", "run", "start"]
