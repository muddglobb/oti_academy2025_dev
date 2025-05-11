import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/api-response.js';
import config from '../config/index.js';

/** 
 * @param {Object} options - Opsi konfigurasi rate limiter
 * @param {number} options.windowMs - Periode waktu dalam milidetik
 * @param {number} options.max - Jumlah maksimum request dalam periode
 * @param {string} options.message - Pesan error kustom
 * @param {string} options.name - Nama identifier untuk rate limiter
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (options = {}) => {
    const {
        windowMs = config.RATE_LIMIT.windowMs,
        max = config.RATE_LIMIT.max,
        message = 'Too many requests, please try again later.',
        name = 'default'
    } = options;
    
    // In development, add logging middleware
    if (config.NODE_ENV === 'development') {
        // Create middleware to log rate limit hits
        const logRateLimitReached = (req, res, next) => {
            const originalStatus = res.status;
            
            res.status = function(code) {
                if (code === 429) {
                    console.warn(`Rate limit '${name}' reached by IP: ${req.ip}`);
                }
                // Call the original status function
                return originalStatus.call(this, code);
            };
            
            next();
        };
        
        // Return an array of middleware functions
        return [
            logRateLimitReached,
            rateLimit({
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
            })
        ];
    }
    
    // In production, just return the rate limiter without the logging middleware
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