import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

// Helper function to create rate limiters with common configuration
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator: (req) => {
      // Rate limit by user ID if authenticated, otherwise by IP
      const userId = req.user?.id;
      const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
      
      // Debug logging untuk troubleshooting
      if (process.env.DEBUG_RATE_LIMIT === 'true') {
        console.log(`🔍 Rate Limit Key: ${userId ? `user:${userId}` : `ip:${ip}`} for ${req.method} ${req.path}`);
      }
      
      return userId ? `user:${userId}` : `ip:${ip}`;
    },
    skip: (req) => {
      // Skip rate limiting for service-to-service requests
      const serviceKey = req.headers['x-service-key'] || req.headers['x-api-key'];
      const isServiceCall = serviceKey === process.env.SERVICE_API_KEY;
      
      // Skip untuk development environment jika perlu
      const isDevelopment = process.env.NODE_ENV === 'development';
      const skipForDev = isDevelopment && req.headers['x-dev-bypass'] === 'true';
      
      return isServiceCall || skipForDev;
    },
    handler: (req, res) => {
      // Fix: gunakan windowMs dari scope yang benar
      const retryAfter = Math.round(windowMs / 1000) || 900;
      
      res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter,
        message: message || 'Rate limit exceeded'
      });
    }
  });
};

// Authentication endpoints - stricter rate limiting
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.',
  skipSuccessfulRequests: true, // Don't count successful auth requests
  skipFailedRequests: false
});

// Password reset - very strict
export const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 password reset attempts per hour
  message: 'Too many password reset attempts. Please try again in an hour.',
  skipSuccessfulRequests: false
});

// Payment endpoints - moderate rate limiting
export const paymentLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 200 payment requests per 15 minutes (fixed comment)
  message: 'Too many payment requests. Please try again later.',
  skipSuccessfulRequests: false
});

// Admin endpoints - higher limits
export const adminLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour for admin
  message: 'Admin rate limit exceeded. Please contact support.',
  skipSuccessfulRequests: true
});

// File upload endpoints - lower limits due to resource intensity
export const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 uploads per 15 minutes
  message: 'Too many file uploads. Please try again later.',
  skipSuccessfulRequests: false
});

// Public API endpoints - standard rate limiting
export const publicApiLimiter = createRateLimiter({
  windowMs: config.RATE_LIMIT?.windowMs || 15 * 60 * 1000,
  max: config.RATE_LIMIT?.max || 100,
  message: 'Too many requests to public API. Please try again later.',
  skipSuccessfulRequests: false
});

// Course/Material browsing - higher limits for browsing
export const browsingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes for browsing
  message: 'Too many browsing requests. Please slow down.',
  skipSuccessfulRequests: true
});

// Default rate limiter (fallback)
export const rateLimiterMiddleware = publicApiLimiter;