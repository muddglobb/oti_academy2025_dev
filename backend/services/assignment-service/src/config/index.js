import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  // Server configuration
  PORT: process.env.PORT || 8005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Service URLs for inter-service communication
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:8001',
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL || 'http://course-service:8002',
  ENROLLMENT_SERVICE_URL: process.env.ENROLLMENT_SERVICE_URL || 'http://enrollment-service:8007',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP
  },
  
  // File upload limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,zip,rar').split(',')
};