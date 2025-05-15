import dotenv from 'dotenv';

dotenv.config();

export default {
  // Server configuration
  PORT: process.env.PORT || 8008, // Choose an available port for material-service
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Security configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Service URLs for inter-service communication
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:8001',
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL || 'http://course-service:8002',
  
  // File upload configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,mp4,zip,doc,docx,ppt,pptx').split(','),
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  }
};