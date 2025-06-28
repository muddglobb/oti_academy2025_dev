import NodeCache from 'node-cache';

// Production-optimized cache instance
const cache = new NodeCache({
  stdTTL: 60 * 60, // 1 hour in seconds
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Avoid deep cloning for performance
  deleteOnExpire: true,
  enableLegacyCallbacks: false
});

// Optimized helper functions
const getCache = (key) => cache.get(key);
const setCache = (key, data, ttl = 3600) => cache.set(key, data, ttl);
const deleteCache = (key) => cache.del(key);
const flushCache = () => cache.flushAll();

const deleteCacheByPattern = (pattern) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.includes(pattern));
  return keysToDelete.length > 0 ? cache.del(keysToDelete) : 0;
};

/**
 * Service untuk menangani caching data assignment
 */
export class CacheService {
  /**
   * Mendapatkan data dari cache berdasarkan key
   * @param {string} key - Cache key
   * @returns {any} Data dari cache atau null jika tidak ada
   */
  static get(key) {
    try {
      return getCache(key);
    } catch (error) {
      console.error(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Menyimpan data ke cache
   * @param {string} key - Cache key
   * @param {any} data - Data yang akan disimpan
   * @param {number} ttl - Time-to-live dalam detik
   * @returns {boolean} Status keberhasilan operasi
   */
  static set(key, data, ttl = 3600) {
    return setCache(key, data, ttl);
  }    /**
   * Menghapus cache berdasarkan key atau pattern
   * @param {string} keyOrPattern - Key atau pattern cache yang akan dihapus
   * @param {boolean} isPattern - Jika true, akan menghapus semua key yang cocok dengan pattern
   * @returns {Promise<boolean>} Success status
   */
  static async invalidate(keyOrPattern, isPattern = false) {
    try {
      console.log(`🗑️ Invalidating cache for ${isPattern ? 'pattern' : 'key'}: ${keyOrPattern}`);
      
      // ✅ Add debug logging - Before invalidation
      const beforeKeys = cache.keys();
      console.log(`📋 Total cache keys before invalidation: ${beforeKeys.length}`);
      
      if (isPattern) {
        const matchingKeys = beforeKeys.filter(key => key.includes(keyOrPattern));
        console.log(`🔍 Keys matching pattern "${keyOrPattern}":`, matchingKeys);
        
        if (matchingKeys.length > 0) {
          const deletedCount = deleteCacheByPattern(keyOrPattern);
          console.log(`🗑️ Deleted ${deletedCount} cache keys by pattern: ${keyOrPattern}`);
        } else {
          console.log(`⚠️ No keys found matching pattern: ${keyOrPattern}`);
        }
      } else {
        const keyExists = beforeKeys.includes(keyOrPattern);
        console.log(`🔍 Key "${keyOrPattern}" exists: ${keyExists}`);
        
        if (keyExists) {
          const deleteResult = deleteCache(keyOrPattern);
          console.log(`🗑️ Delete result for key "${keyOrPattern}": ${deleteResult}`);
        } else {
          console.log(`⚠️ Key "${keyOrPattern}" not found in cache`);
        }
      }
      
      // ✅ Add debug logging - After invalidation
      const afterKeys = cache.keys();
      console.log(`📋 Total cache keys after invalidation: ${afterKeys.length}`);
      
      // ✅ Verify specific key is gone
      if (!isPattern) {
        const stillExists = afterKeys.includes(keyOrPattern);
        console.log(`🧪 Key "${keyOrPattern}" still exists after invalidation: ${stillExists}`);
      }
      
      console.log(`✅ Cache invalidation completed for: ${keyOrPattern}`);
      return true;
    } catch (error) {
      console.error(`❌ Cache invalidation error: ${error.message}`);
      return false;
    }
  }
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
   * Clear all cache - untuk debugging
   * @returns {boolean} Success status
   */
  static clearAll() {
    try {
      console.log('🧹 Clearing all cache');
      const beforeCount = cache.keys().length;
      console.log(`📋 Cache keys before clear: ${beforeCount}`);
      
      flushCache();
      
      const afterCount = cache.keys().length;
      console.log(`📋 Cache keys after clear: ${afterCount}`);
      console.log('✅ All cache cleared');
      return true;
    } catch (error) {
      console.error(`Cache clear error: ${error.message}`);
      return false;
    }
  }

  /**
   * Get cache statistics for debugging
   * @returns {Object} Cache statistics
   */
  static getStats() {
    try {
      const keys = cache.keys();
      const stats = cache.getStats();
      
      return {
        totalKeys: keys.length,
        keys: keys,
        stats: stats
      };
    } catch (error) {
      console.error(`Cache stats error: ${error.message}`);
      return { error: error.message };
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
    const cacheKey = `${key}:${req.originalUrl}`;
    
    try {
      const cachedData = getCache(cacheKey);
      
      if (cachedData) {
        console.log(`🔄 Cache hit for ${cacheKey}`);
        return res.json(cachedData);
      }
      
      console.log(`🔍 Cache miss for ${cacheKey}`);
      
      // Modify res.json to cache the response before sending
      const originalJson = res.json;
      res.json = function(data) {
        try {
          setCache(cacheKey, data, ttl);
        } catch (err) {
          console.error(`Error setting cache: ${err.message}`);
        }
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
        try {
          CacheService.invalidate(pattern, true);
        } catch (err) {
          console.error(`Error invalidating cache: ${err.message}`);
        }
      }
      
      // Call the original send method
      return originalSend.apply(this, arguments);
    };
    
    next();
  };
};