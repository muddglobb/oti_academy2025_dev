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

# Tambahkan setelah npm install/ci dan sebelum npx prisma generate
RUN mkdir -p node_modules/.prisma node_modules/@prisma/engines
RUN chmod -R 777 node_modules/.prisma node_modules/@prisma

# Generate Prisma client
RUN npx prisma generate

# Railway specific environment variables
ENV NODE_ENV=development
ENV PORT=8006

# Define health check to ensure the service is ready for traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8006/health || exit 1

# Expose port
EXPOSE 8006

# Renamed to payment-enrollment-service
LABEL service="payment-enrollment-service"

# Start command with schema push
CMD sh -c "npx prisma db push && node src/index.js"
