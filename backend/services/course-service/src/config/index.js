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
  
  // Service-to-service authentication
  INTERNAL_SERVICE_TOKEN: process.env.INTERNAL_SERVICE_TOKEN,
  INTERNAL_SERVICE_API_KEY: process.env.INTERNAL_SERVICE_API_KEY,
  
  // Whitelisted service IPs for rate limiting exemption
  PACKAGE_SERVICE_IP: process.env.PACKAGE_SERVICE_IP,
  PAYMENT_SERVICE_IP: process.env.PAYMENT_SERVICE_IP,
  API_GATEWAY_IP: process.env.API_GATEWAY_IP,

    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Course defaults
  DEFAULT_COURSE_QUOTA: process.env.DEFAULT_TOTAL_QUOTA,
  DEFAULT_SESSION_DURATION: 2 // hours
};