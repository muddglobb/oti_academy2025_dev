import dotenv from 'dotenv';

dotenv.config();

export default {
  // Server configuration
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Security configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Service URLs for inter-service communication
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:8001',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Course defaults
  DEFAULT_COURSE_QUOTA: 100,
  DEFAULT_SESSION_DURATION: 2 // hours
};