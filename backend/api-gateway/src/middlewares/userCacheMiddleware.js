import redisClient from '../utils/redisClient.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Middleware to cache user profile data in Redis
 * Checks if the user profile data exists in cache and returns it
 * Otherwise, it proceeds to the next middleware/controller and caches the response
 */
export const userProfileCache = async (req, res, next) => {
  // Skip cache if Redis is not available
  if (redisClient.status !== 'ready') {
    logger.warn('Redis not ready, skipping cache');
    return next();
  }

  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  try {
    // Construct cache key based on the route
    let cacheKey;
    if (req.path === '/me' && req.user) {
      cacheKey = `${config.REDIS.keyPrefix}user:${req.user.id}`;
    } else if (req.params.id) {
      cacheKey = `${config.REDIS.keyPrefix}user:${req.params.id}`;
    } else {
      // For non-specific user routes, don't use cache
      return next();
    }

    // Try to get data from cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Cache miss, store original send method
    logger.info(`Cache miss for ${cacheKey}`);
    const originalSend = res.send;

    // Override send method to cache response
    res.send = function(body) {
      try {
        const parsedBody = JSON.parse(body);
        
        // Only cache successful responses
        if (res.statusCode === 200 && parsedBody.status === 'success') {
          // Store in Redis with TTL
          redisClient.setEx(
            cacheKey,
            config.REDIS.ttl.userProfile,
            body
          ).catch(err => logger.error(`Redis cache error: ${err.message}`));
        }
      } catch (error) {
        logger.error(`Cache response parse error: ${error.message}`);
      }

      // Call original send with unchanged arguments
      originalSend.apply(res, arguments);
    };

    next();
  } catch (error) {
    logger.error(`User profile cache error: ${error.message}`);
    next();
  }
};

/**
 * Middleware to invalidate user profile cache when user data is modified
 */
export const userProfileCacheInvalidator = async (req, res, next) => {
  // Skip if Redis is not available
  if (redisClient.status !== 'ready') {
    return next();
  }

  try {
    // Only proceed for methods that modify data
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      let userId;
      
      // Determine which user's cache to invalidate
      if (req.params.id) {
        userId = req.params.id;
      } else if (req.user) {
        userId = req.user.id;
      }

      if (userId) {
        const cacheKey = `${config.REDIS.keyPrefix}user:${userId}`;
        logger.info(`Invalidating cache for ${cacheKey}`);
        await redisClient.del(cacheKey);
      }
    }
    
    next();
  } catch (error) {
    logger.error(`Cache invalidation error: ${error.message}`);
    next();
  }
};