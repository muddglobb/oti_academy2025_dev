import NodeCache from 'node-cache';

// Membuat cache instance dengan standar TTL 60 menit
const cache = new NodeCache({
  stdTTL: 60 * 60, // 1 jam dalam detik
  checkperiod: 120, // Cek data yang expired setiap 2 menit
  useClones: false // Untuk menghindari deep cloning yang bisa memperlambat
});

// Helper functions untuk operasi cache
const getCache = (key) => {
  return cache.get(key);
};

const setCache = (key, data, ttl = 3600) => {
  return cache.set(key, data, ttl);
};

const deleteCache = (key) => {
  return cache.del(key);
};

const flushCache = () => {
  return cache.flushAll();
};

const deleteCacheByPattern = (pattern) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.includes(pattern));
  return cache.del(keysToDelete);
};

/**
 * Service untuk menangani caching data assignment
 */
export class CacheService {
  /**
   * Mendapatkan cache untuk sebuah key, atau menyimpan hasil dari callback jika cache tidak ada
   * @param {string} key - Cache key
   * @param {Function} callback - Async function yang akan dipanggil jika cache tidak ada
   * @param {number} ttl - Time-to-live dalam detik
   * @returns {Promise<any>} Data dari cache atau hasil callback
   */
  static async getOrSet(key, callback, ttl = 3600) {
    try {
      // Try to get data from cache first
      const cachedData = getCache(key);
      
      if (cachedData) {
        console.log(`🔄 Cache hit for ${key}`);
        return cachedData;
      }
      
      console.log(`🔍 Cache miss for ${key}, fetching fresh data`);
      
      // If cache miss, execute callback to get fresh data
      const freshData = await callback();
      
      // Store result in cache with TTL
      setCache(key, freshData, ttl);
      
      return freshData;
    } catch (error) {
      console.error(`Cache service error for key ${key}: ${error.message}`);
      // If anything goes wrong with cache, just return the callback result
      return callback();
    }
  }
  
  /**
   * Menghapus cache untuk sebuah key atau pattern
   * @param {string} keyOrPattern - Cache key atau pattern (dengan *)
   * @param {boolean} isPattern - Apakah key adalah pattern
   * @returns {Promise<boolean>} Success status
   */
  static async invalidate(keyOrPattern, isPattern = false) {
    try {
      console.log(`🗑️ Invalidating cache for ${isPattern ? 'pattern' : 'key'}: ${keyOrPattern}`);
      
      if (isPattern) {
        deleteCacheByPattern(keyOrPattern);
      } else {
        deleteCache(keyOrPattern);
      }
      
      return true;
    } catch (error) {
      console.error(`Cache invalidation error: ${error.message}`);
      return false;
    }
  }
}

// Cache middleware for Express routes
export const cacheMiddleware = (key, ttl = 3600) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate a cache key based on the provided key and request params/query
    const cacheKey = `${key}-${req.originalUrl}`;
    
    try {
      const cachedData = getCache(cacheKey);
      
      if (cachedData) {
        console.log(`🔄 Cache hit for ${cacheKey}`);
        return res.json(cachedData);
      }
      
      // Modify res.json to cache the response before sending
      const originalJson = res.json;
      res.json = function(data) {
        setCache(cacheKey, data, ttl);
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

// Cache invalidation middleware
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method to invalidate cache after successful operations
    res.send = function() {
      // Only invalidate on successful operations (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        CacheService.invalidate(pattern, true)
          .catch(err => console.error(`Error invalidating cache: ${err.message}`));
      }
      
      // Call the original send method
      return originalSend.apply(this, arguments);
    };
    
    next();
  };
};