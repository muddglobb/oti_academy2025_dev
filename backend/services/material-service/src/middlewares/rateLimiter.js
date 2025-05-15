import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/api-response.js';
import config from '../config/index.js';

/**
 * Create a rate limiter with custom options
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = config.RATE_LIMIT.windowMs,
    max = config.RATE_LIMIT.max,
    message = 'Too many requests, please try again later.',
    name = 'default'
  } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    },
    handler: (req, res) => {
      return res.status(429).json(
        ApiResponse.error('Too many requests. Please try again later.')
      );
    }
  });
};