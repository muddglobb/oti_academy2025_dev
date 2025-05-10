FROM node:20-alpine

# Install OpenSSL explicitly to fix Prisma OpenSSL detection issue
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /home/appuser/app

# Create a non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY --chown=appuser:appuser . .

# Set NODE_PATH to include parent directories for module resolution
ENV NODE_PATH=/home/appuser

RUN mkdir -p /home/appuser/app/node_modules/.prisma
RUN chown -R appuser:appuser /home/appuser/app/node_modules

# Use non-root user
USER appuser

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 8007

# Start command with schema push for development (similar to auth-service)
# Force reset the database schema to remove relationships
CMD sh -c "npx prisma db push --accept-data-loss && node src/index.js"