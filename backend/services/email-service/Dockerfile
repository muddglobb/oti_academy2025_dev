FROM node:20-slim

# Create app directory with proper permissions
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
# Using npm install instead of npm ci to update the lock file
RUN npm install --production

# Copy app source
COPY --chown=appuser:appuser . .

# Create dist directory and run copy-templates script
RUN mkdir -p /app/dist && npm run copy-templates

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8008

# Start command
CMD ["node", "src/index.js"]