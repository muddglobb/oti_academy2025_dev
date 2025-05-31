FROM node:20-slim

WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
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