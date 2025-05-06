FROM node:20-alpine

# Update npm sebelum langkah lainnya
RUN npm install -g npm@latest

WORKDIR /home/appuser/app

# Buat non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /home/appuser

# Salin package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Salin kode aplikasi dan prisma
COPY --chown=appuser:appgroup . .

# Generate Prisma client
RUN npx prisma generate

# Buat direktori logs
RUN mkdir -p logs && chown -R appuser:appgroup logs

# Switch ke non-root user
USER appuser

EXPOSE ${PORT}

# Gunakan db push untuk fase pengembangan
CMD sh -c "npx prisma db push && node src/index.js"