import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/api-response.js';

const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Create a rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @param {string} options.name - Name for the rate limiter (for logging)
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @returns {Function} - Express middleware
 */
export const createRateLimiter = ({ name = 'API', windowMs = 15 * 60 * 1000, max = 100 }) => {
    if(NODE_ENV !== 'development') { 
        // Create a logging middleware that runs before the rate limiter
        const logRateLimitReached = (req, res, next) => {
            // Store the original status function
            const originalStatus = res.status;
            
            // Override status function to detect 429 responses
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
                        ApiResponse.error('Terlalu banyak request. Silakan coba lagi nanti.')
                    );
                }
            })
        ];
    }
    
    // In development, just return the rate limiter without the logging middleware
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
                ApiResponse.error('Terlalu banyak request. Silakan coba lagi nanti.')
            );
        }
    });
};