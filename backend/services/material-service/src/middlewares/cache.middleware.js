import { CacheService } from '../services/cache.service.js';
import config from '../config/index.js';

/**
 * Sanitize data to prevent XSS attacks
 * @param {any} data - Data to sanitize
 * @returns {any} Sanitized data
 */
const sanitizeData = (data) => {
  if (typeof data === 'string') {
    // Remove potentially dangerous HTML/JS content
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }
  
  return data;
};

/**
 * Validate that response data is safe to cache and send
 * @param {any} data - Response data to validate
 * @returns {boolean} Whether data is safe
 */
const isDataSafe = (data) => {
  try {
    // Don't cache if data contains HTML/script tags
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    if (/<script|<iframe|javascript:|on\w+\s*=/i.test(dataStr)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Middleware to cache API responses using Redis
 * @param {string} type - Cache type/prefix
 * @param {number} ttl - Time-to-live in seconds
 */
export const cacheMiddleware = (type = 'general', ttl = null) => {
  return async (req, res, next) => {
    // Skip cache in development if requested
    if (process.env.NODE_ENV === 'development' && req.query.skipCache === 'true') {
      return next();
    }

    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Use default TTL if not specified
    const cacheTTL = ttl || config.CACHE.TTL.DEFAULT;

    // Create a cache key based on the request path and query (sanitized)
    const sanitizedUrl = (req.originalUrl || req.url).replace(/[<>'"&]/g, '');
    const cacheKey = `${type}:${sanitizedUrl}`;
    
    try {      // Check if cached data exists first
      const existingCache = await CacheService.get(cacheKey);
      if (existingCache && !res.headersSent) {
        // Validate cached data before sending
        if (isDataSafe(existingCache)) {
          const sanitizedCache = sanitizeData(existingCache);
          return res.json(sanitizedCache);
        } else {
          // Invalid cached data, remove it
          await CacheService.invalidate(cacheKey);
        }
      }
      
      // Store original send and json functions
      const originalSend = res.send;
      const originalJson = res.json;
      let isResponseCaptured = false;
      
      // Override send function
      res.send = function(data) {
        if (!isResponseCaptured && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            // Validate and sanitize data before caching
            if (isDataSafe(data)) {
              const sanitizedData = sanitizeData(data);
              CacheService.set(cacheKey, sanitizedData, cacheTTL).catch(err => {
                console.error(`Cache set error: ${err.message}`);
              });
            }
          } catch (error) {
            console.error(`Cache set error: ${error.message}`);
          }
          isResponseCaptured = true;
        }
        return originalSend.apply(res, arguments);
      };
      
      // Override json function
      res.json = function(data) {
        if (!isResponseCaptured && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            // Validate and sanitize data before caching
            if (isDataSafe(data)) {
              const sanitizedData = sanitizeData(data);
              CacheService.set(cacheKey, sanitizedData, cacheTTL).catch(err => {
                console.error(`Cache set error: ${err.message}`);
              });
            }
          } catch (error) {
            console.error(`Cache set error: ${error.message}`);
          }
          isResponseCaptured = true;
        }
        return originalJson.apply(res, arguments);
      };
      
      next();
    } catch (error) {
      console.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

/**
 * Middleware to invalidate cache patterns
 * @param {string} pattern - Cache key pattern to invalidate
 */
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    // Store original send and json functions
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Overwrite the send function
    res.send = function() {
      // If successful response, invalidate cache
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          CacheService.invalidate(pattern, true).catch(err => {
            console.error(`Cache invalidation error: ${err.message}`);
          });
        } catch (error) {
          console.error(`Cache invalidation error: ${error.message}`);
        }
      }
      
      // Call original send function
      return originalSend.apply(res, arguments);
    };
    
    // Overwrite the json function
    res.json = function() {
      // If successful response, invalidate cache
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          CacheService.invalidate(pattern, true).catch(err => {
            console.error(`Cache invalidation error: ${err.message}`);
          });
        } catch (error) {
          console.error(`Cache invalidation error: ${error.message}`);
        }
      }
      
      // Call original json function
      return originalJson.apply(res, arguments);
    };
    
    next();
  };
};
