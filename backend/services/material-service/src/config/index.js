import dotenv from 'dotenv';

dotenv.config();

export default {
  // Server configuration
  PORT: process.env.PORT || 8003, // Choose an available port for material-service
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
    // Security configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Service URLs for inter-service communication
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001',
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://payment-service-api:8006',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  }
};