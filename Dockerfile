# backend/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (use package.json)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Ensure uploads dir exists and is writable
RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads

ENV NODE_ENV=production
EXPOSE 5000

# Use non-root user
USER node

CMD ["node", "app.js"]