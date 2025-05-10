FROM node:20-alpine

# Install OpenSSL explicitly to fix Prisma OpenSSL detection issue
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /app

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chmod -R 777 /app/logs

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create fallback directory for enrollment fallback mechanism
RUN mkdir -p /app/enrollment-fallback && chmod -R 777 /app/enrollment-fallback

# Railway specific environment variables
ENV NODE_ENV=production
ENV PORT=8006

# Define health check to ensure the service is ready for traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8006/health || exit 1

# Expose port
EXPOSE 8006

# Start command with schema push
CMD sh -c "npx prisma db push && node src/index.js"
