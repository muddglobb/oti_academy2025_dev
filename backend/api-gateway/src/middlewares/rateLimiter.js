import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const rateLimiterMiddleware = rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  skipSuccessfulRequests: false,
  // You can add Redis store here later for distributed rate limiting
});