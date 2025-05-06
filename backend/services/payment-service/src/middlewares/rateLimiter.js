import rateLimit from 'express-rate-limit';

/**
 * Create a rate limiter middleware with custom options
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.'
    }
  };

  const limiterOptions = {
    ...defaultOptions,
    ...options
  };

  // Log rate limiter creation
  console.log(`Creating rate limiter: ${options.name || 'Default'}`);

  return rateLimit(limiterOptions);
};