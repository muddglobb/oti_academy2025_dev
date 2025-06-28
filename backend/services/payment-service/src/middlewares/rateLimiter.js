import rateLimit from 'express-rate-limit';

/**
 * Create a rate limiter middleware with custom options
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 200,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    name = 'Default'
  } = options;

  // Log rate limiter creation
  console.log(`Creating rate limiter: ${name}`);

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
      
      // Debug logging
      if (process.env.DEBUG_RATE_LIMIT === 'true') {
        console.log(`🔍 ${name} Rate Limit Key: ${userId ? `user:${userId}` : `ip:${ip}`} for ${req.method} ${req.path}`);
      }
      
      return userId ? `user:${userId}` : `ip:${ip}`;
    },
    skip: (req) => {
      // Skip rate limiting for service-to-service requests
      const serviceKey = req.headers['x-service-key'] || req.headers['x-api-key'];
      const isServiceCall = serviceKey === process.env.SERVICE_API_KEY;
      
      // Skip in development environment
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isServiceCall || isDevelopment) {
        if (process.env.DEBUG_RATE_LIMIT === 'true') {
          console.log(`⏭️ Skipping rate limit for ${name}: ${isServiceCall ? 'Service Call' : 'Development'}`);
        }
        return true;
      }
      
      return false;
    },
    handler: (req, res) => {
      const userId = req.user?.id || 'anonymous';
      const ip = req.ip || 'unknown';
      
      console.warn(`🚫 Rate limit exceeded for ${name}: ${userId} from IP: ${ip} on ${req.method} ${req.path}`);
      
      const retryAfter = Math.round(windowMs / 1000) || 900;
      
      res.status(429).json({
        status: 'error',
        error: 'Too many requests, please try again later.',
        message,
        retryAfter,
        ...(process.env.DEBUG_RATE_LIMIT === 'true' && {
          debug: {
            userId,
            ip,
            limit: max,
            window: `${windowMs / 1000}s`
          }
        })
      });
    }
  });
};

// Specific rate limiters for different endpoints
export const paymentApiLimiter = createRateLimiter({
  name: 'Payment API',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many payment API requests. Please try again later.',
  skipSuccessfulRequests: false
});

export const paymentProcessLimiter = createRateLimiter({
  name: 'Payment Process',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 payment processes per hour
  message: 'Too many payment processing requests. Please try again later.',
  skipSuccessfulRequests: true // Don't count successful payments
});

export const paymentStatusLimiter = createRateLimiter({
  name: 'Payment Status',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 status checks per 15 minutes
  message: 'Too many payment status requests. Please try again later.',
  skipSuccessfulRequests: true
});

// Default limiter
export const defaultLimiter = createRateLimiter({
  name: 'Default API',
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
});