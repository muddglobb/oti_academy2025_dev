FROM node:24-alpine3.21

# Update npm to latest version
RUN npm install -g npm@latest

# Buat direktori aplikasi
WORKDIR /usr/src/app

# Install required packages for Prisma and OpenSSL
RUN apk add --no-cache openssl

# Buat user non-root untuk keamanan
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies with correct permissions
RUN npm ci && \
    mkdir -p node_modules/@prisma/engines && \
    chmod -R 777 node_modules/@prisma

# Salin kode aplikasi
COPY --chown=appuser:appgroup . .

# Buat direktori log dengan perizinan yang tepat
RUN mkdir -p logs && chown -R appuser:appgroup logs

# Generate Prisma client as root to avoid permissions issues
RUN npx prisma generate

# Make directories writable for the non-root user
RUN chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Port yang digunakan oleh aplikasi
EXPOSE 8004

# Start command that applies schema, runs seed, and starts app
CMD /bin/sh -c "npx prisma db push && node src/index.js"