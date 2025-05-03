# filepath: e:\PROJECT\OTI Academy\oti_academy2025_dev\backend\api-gateway\Dockerfile
FROM node:20-alpine

# Buat direktori aplikasi
WORKDIR /usr/src/app

# Buat user non-root untuk keamanan
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm ci --only=production

# Salin kode aplikasi
COPY --chown=appuser:appgroup . .

# Buat direktori log dengan perizinan yang tepat
RUN mkdir -p logs && chown -R appuser:appgroup logs

# Buat direktori untuk upload file sementara
RUN mkdir -p temp-uploads && chown -R appuser:appgroup temp-uploads

# Gunakan user non-root
USER appuser

# Port yang digunakan oleh aplikasi
EXPOSE 8000

# Jalankan aplikasi
CMD ["node", "src/index.js"]