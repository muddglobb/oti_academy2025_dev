import { getCache, setCache } from '../utils/redisClient.js';

/**
 * Generates a cache key based on request parameters
 * @param {string} prefix - prefix for the key
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
const generateCacheKey = (prefix, req) => {
  const path = req.originalUrl || req.url;
  const queryParams = new URLSearchParams(req.query).toString();
  return `${prefix}:${path}${queryParams ? `?${queryParams}` : ''}`;
};

/**
 * Middleware for caching responses
 * @param {string} prefix - prefix for the cache key
 * @param {number} ttl - time to live in seconds
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (prefix = 'package', ttl = 3600) => async (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  try {
    const cacheKey = generateCacheKey(prefix, req);
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      console.log(`🔄 Cache hit for ${cacheKey}`);
      return res.status(200).json(cachedData);
    }

    console.log(`🔍 Cache miss for ${cacheKey}`);
    
    // Store original send method
    const originalSend = res.send;
    
    // Override send method to cache response before sending
    res.send = function (body) {
      try {
        const data = JSON.parse(body);
        
        // Only cache successful responses
        if (res.statusCode === 200 && data.status === 'success') {
          setCache(cacheKey, data, ttl)
            .catch(error => console.error(`Cache error: ${error}`));
        }
      } catch (error) {
        console.error(`Response parsing error in cache middleware: ${error}`);
      }
      
      // Call original send with original arguments
      return originalSend.call(this, body);
    };

    next();
  } catch (error) {
    console.error(`Cache middleware error: ${error}`);
    next();
  }
};

/**
 * Cache invalidation middleware
 * @param {string} pattern - key pattern to invalidate
 */
export const invalidateCache = (pattern) => async (req, res, next) => {
  try {
    // Store original send
    const originalSend = res.send;
    
    // Override send to invalidate cache after successful response
    res.send = function (body) {
      try {
        const data = JSON.parse(body);
        
        // Only invalidate on successful operations
        if (res.statusCode >= 200 && res.statusCode < 300 && data.status === 'success') {
          // If we have a specific ID, generate a more specific pattern
          let cachePattern = pattern;
          if (req.params.id || req.params.packageId) {
            const id = req.params.id || req.params.packageId;
            cachePattern = `${pattern}:*${id}*`;
          }
          
          console.log(`🗑️ Invalidating cache for pattern ${cachePattern}`);
          
          // Import here to avoid circular dependency
          import('../utils/redisClient.js')
            .then(({ deletePattern }) => deletePattern(cachePattern))
            .catch(error => console.error(`Cache invalidation error: ${error}`));
        }
      } catch (error) {
        console.error(`Response parsing error in invalidateCache: ${error}`);
      }
      
      // Call original send
      return originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    console.error(`Invalidate cache middleware error: ${error}`);
    next();
  }
};