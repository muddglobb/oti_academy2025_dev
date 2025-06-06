import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server configuration
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Service URLs
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://payment-service-api:8006',
  MATERIAL_SERVICE_URL: process.env.MATERIAL_SERVICE_URL || 'http://material-service-api:8003',
  
  // Security configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  },

  // Redis configuration
  REDIS: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    keyPrefix: 'otiAcademy:',
    // TTL (Time-To-Live) values in seconds
    ttl: {
      token: 3600, // 1 hour for tokens
      userProfile: 300, // 5 minutes for user profiles
      blacklist: 86400 * 7 // 7 days for blacklisted tokens
    }
  }
};

export default config;