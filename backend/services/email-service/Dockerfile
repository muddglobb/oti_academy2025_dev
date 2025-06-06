FROM node:24-alpine3.21

WORKDIR /app

# Create non-root user for security (Alpine Linux syntax)
RUN addgroup -S appuser && adduser -S -G appuser appuser
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --development

# Copy app source
COPY --chown=appuser:appuser . .

# Create dist directory and run copy-templates script
# Fixed path from /dist to /app/dist
RUN mkdir -p /app/dist && npm run copy-templates

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8008

# Start command
CMD ["node", "src/index.js"]