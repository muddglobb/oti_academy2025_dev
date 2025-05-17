FROM node:20-alpine

# Install OpenSSL explicitly to fix Prisma OpenSSL detection issue
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /home/appuser/app

# Create a non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Copy package.json and prisma files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application files
COPY --chown=appuser:appuser . .

# Set NODE_PATH to include parent directories for module resolution
ENV NODE_PATH=/home/appuser

RUN mkdir -p /home/appuser/app/node_modules/.prisma
RUN chown -R appuser:appuser /home/appuser/app/node_modules

# Tambahkan setelah npm install/ci dan sebelum npx prisma generate
RUN mkdir -p node_modules/.prisma node_modules/@prisma/engines
RUN chmod -R 777 node_modules/.prisma node_modules/@prisma

# Use non-root user
USER appuser

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 8005

# Start command with schema push for development (similar to auth-service)
CMD sh -c "npx prisma db push && node prisma/seed.js && node src/index.js"