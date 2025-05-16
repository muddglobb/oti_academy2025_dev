import { CacheService } from '../services/cache.service.js';

/**
 * Middleware to cache API responses
 * @param {string} type - Cache type/prefix
 * @param {number} ttl - Time-to-live in seconds
 */
export const cacheMiddleware = (type = 'general', ttl = 3600) => {
  return async (req, res, next) => {
    // Skip cache in development
    if (process.env.NODE_ENV === 'development' && req.query.skipCache === 'true') {
      return next();
    }

    // Create a cache key based on the request path and query
    const cacheKey = `${type}:${req.originalUrl || req.url}`;
    
    try {
      // Get from cache or continue
      const cachedData = await CacheService.getOrSet(cacheKey, async () => {
        // Store original send function
        const originalSend = res.send;
        
        // Create a promise to capture the response
        let resolveResponseData;
        const responsePromise = new Promise(resolve => {
          resolveResponseData = resolve;
        });
        
        // Overwrite the send function to capture data
        res.send = function(data) {
          resolveResponseData(data);
          return originalSend.apply(res, arguments);
        };
        
        // Continue middleware chain
        next();
        
        // Wait for response data
        return await responsePromise;
      }, ttl);
      
      // If we got cached data and haven't sent response yet
      if (!res.headersSent) {
        res.send(cachedData);
      }
    } catch (error) {
      console.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

/**
 * Middleware to invalidate cache
 * @param {string} pattern - Cache key pattern to invalidate
 */
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    
    // Overwrite the send function
    res.send = function() {
      // If successful response, invalidate cache
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          CacheService.invalidate(pattern, true);
        } catch (error) {
          console.error(`Cache invalidation error: ${error.message}`);
        }
      }
      
      // Call original send function
      return originalSend.apply(res, arguments);
    };
    
    next();
  };
};