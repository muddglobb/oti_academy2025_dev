/**
 * Configuration management
 * Loads and validates environment variables
 */

// Validate environment variables
const requiredEnvVars = ['DATABASE_URL', 'PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is required but not set.`);
    process.exit(1);
  }
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3005,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-for-dev-only',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    course: process.env.COURSE_SERVICE_URL || 'http://localhost:3003',
    package: process.env.PACKAGE_SERVICE_URL || 'http://localhost:3004',
  }
};

export default config;
