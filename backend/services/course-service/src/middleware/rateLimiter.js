import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/api-response.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;

const KNOWN_SERVICE_URLS = [
  process.env.API_GATEWAY_URL || 'http://api-gateway:8000',
  process.env.PAYMENT_SERVICE_URL || 'http://payment-service-api:8006',
  process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005'
];

const isServiceToServiceRequest = (req) => {
  const apiKey = req.headers['x-api-key'] || req.headers['x-service-key'];
  if (apiKey === SERVICE_API_KEY) {
    return true;
  }

  const userAgent = req.headers['user-agent'] || '';
  const knownServicePatterns = ['axios', 'node-fetch', 'service-client', 'internal-service'];

  const referer = req.headers['referer'] || req.headers['origin'] || '';
  const isKnownService = KNOWN_SERVICE_URLS.some(url => referer.includes(url.replace('http://', '').replace('https://', '')));

  return knownServicePatterns.some(pattern => userAgent.toLowerCase().includes(pattern)) || isKnownService;
};

export const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000,
        max = 100,
        message = 'Too many requests, please try again later.',
        name = 'default'
    } = options;
    
    if (NODE_ENV !== 'development') {
        const logRateLimitReached = (req, res, next) => {
            const originalStatus = res.status;
            
            res.status = function(code) {
                if (code === 429) {
                    const clientIP = req.ip || req.headers['x-forwarded-for'] || 'unknown';
                    console.warn(`Rate limit '${name}' reached by IP: ${clientIP}`);
                }
                return originalStatus.call(this, code);
            };
            
            next();
        };
        
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
                skip: (req) => {
                    const isServiceRequest = isServiceToServiceRequest(req);
                    
                    if (isServiceRequest) {
                        const clientIP = req.ip || req.headers['x-forwarded-for'] || 'unknown';
                        console.log(`Skipping rate limit for service-to-service request from: ${clientIP}`);
                        return true;
                    }
                    
                    return false;
                },
                handler: (req, res) => {
                    return res.status(429).json(
                        ApiResponse.error(message)
                    );
                }
            })
        ];
    } else {
        return (req, res, next) => {
            console.log(`[DEV MODE] Rate limiting disabled for '${name}'`);
            next();
        };
    }
};

export const publicApiLimiter = createRateLimiter({
    name: 'Public API',
    windowMs: 15 * 60 * 1000,
    max: 100
});

export const batchApiLimiter = createRateLimiter({
    name: 'Batch API',
    windowMs: 15 * 60 * 1000,
    max: 1000
});

export const adminLimiter = createRateLimiter({
    name: 'Admin Operations',
    windowMs: 60 * 60 * 1000,
    max: 2000
});
