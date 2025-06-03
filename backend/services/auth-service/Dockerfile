FROM node:24-alpine3.21

# Update npm sebelum langkah lainnya
RUN npm install -g npm@latest

WORKDIR /home/appuser/app

# Buat non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /home/appuser

# Salin package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=development

# Salin kode aplikasi dan prisma
COPY --chown=appuser:appgroup . .

# Tambahkan setelah npm install/ci dan sebelum npx prisma generate
RUN mkdir -p node_modules/.prisma node_modules/@prisma/engines
RUN chmod -R 777 node_modules/.prisma node_modules/@prisma

# Generate Prisma client
RUN npx prisma generate

# Buat direktori logs
RUN mkdir -p logs && chown -R appuser:appgroup logs

# Switch ke non-root user
USER appuser

EXPOSE ${PORT}

# Gunakan db push untuk fase pengembangan
CMD sh -c "npx prisma db push && node src/index.js"