import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/api-response.js';
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

/** 
 * @param {Object} options - Opsi konfigurasi rate limiter
 * @param {number} options.windowMs - Periode waktu dalam milidetik (default: 15 menit)
 * @param {number} options.max - Jumlah maksimum request dalam periode (default: 100)
 * @param {string} options.message - Pesan error kustom
 * @param {string} options.name - Nama identifier untuk rate limiter
 * @returns {Function} Express middleware
 */

export const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 menit
        max = 100, // limit each IP to 100 requests per windowMs
        message = 'Too many requests, please try again later.',
        name = 'default'
    } = options;

    // Create middleware that checks for API Gateway headers first
    const gatewayAwareMiddleware = (req, res, next) => {
        // Skip rate limiting if request comes from API Gateway
        const isFromGateway = req.headers['x-api-gateway'] === 'true' || 
                             req.headers['x-service-key'] === process.env.SERVICE_API_KEY ||
                             req.headers['x-service-key'] === 'gateway-internal';
        
        if (isFromGateway) {
            console.log(`[GATEWAY MODE] Rate limiting bypassed for '${name}' - request from API Gateway`);
            return next();
        }

        // If not from gateway and in development, still skip
        if (NODE_ENV === 'DEVELOPMENT') {
            console.log(`[DEV MODE] Rate limiting disabled for '${name}'`);
            return next();
        }

        // Otherwise apply rate limiting
        next();
    };

    if(NODE_ENV !== 'DEVELOPMENT') { 
        // Create a logging middleware that runs before the rate limiter
        const logRateLimitReached = (req, res, next) => {
            // Skip if from gateway
            const isFromGateway = req.headers['x-api-gateway'] === 'true' || 
                                 req.headers['x-service-key'] === process.env.SERVICE_API_KEY ||
                                 req.headers['x-service-key'] === 'gateway-internal';
            
            if (isFromGateway) {
                return next();
            }

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
            gatewayAwareMiddleware,
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
                        ApiResponse.error(message)
                    );
                },
                skip: (req) => {
                    // Skip if from gateway
                    return req.headers['x-api-gateway'] === 'true' || 
                           req.headers['x-service-key'] === process.env.SERVICE_API_KEY ||
                           req.headers['x-service-key'] === 'gateway-internal';
                }
                // onLimitReached removed - this was causing the warning
            })
        ];
    } else {
        // Return dummy middleware for development
        return gatewayAwareMiddleware;
    }
};

// Update these exports to handle arrays of middleware
export const securityLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many attempts, please try again after 15 minutes',
    name: 'security'
});

export const standardLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    name: 'standard'
});

export const relaxedLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 300,
    name: 'relaxed'
});