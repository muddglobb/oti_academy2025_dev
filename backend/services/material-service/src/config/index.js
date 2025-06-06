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
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  },

  // Cache configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour default
  
  // Redis cache TTL configurations (in seconds)
  CACHE: {
    TTL: {
      MATERIAL: parseInt(process.env.CACHE_TTL_MATERIAL) || 1800, // 30 minutes
      COURSE_MATERIALS: parseInt(process.env.CACHE_TTL_COURSE_MATERIALS) || 900, // 15 minutes
      ALL_MATERIALS: parseInt(process.env.CACHE_TTL_ALL_MATERIALS) || 600, // 10 minutes
      COURSE_INFO: parseInt(process.env.CACHE_TTL_COURSE_INFO) || 1800, // 30 minutes
      DEFAULT: parseInt(process.env.CACHE_TTL_DEFAULT) || 3600 // 1 hour
    }
  }
};