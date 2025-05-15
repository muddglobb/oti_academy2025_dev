import NodeCache from 'node-cache';
import config from '../config/index.js';

// Create cache instance with standard TTL of 60 minutes
const cache = new NodeCache({
  stdTTL: config.CACHE_TTL, 
  checkperiod: 120, // Check expired data every 2 minutes
  useClones: false // To avoid deep cloning which can slow things down
});

/**
 * Service for handling cache for material data
 */
export class CacheService {
  /**
   * Get cache for a key, or store result of callback if cache not found
   * @param {string} key - Cache key
   * @param {Function} callback - Async function to call if cache miss
   * @param {number} ttl - Time-to-live in seconds
   * @returns {Promise<any>} Data from cache or callback result
   */
  static async getOrSet(key, callback, ttl = config.CACHE_TTL) {
    const cachedData = cache.get(key);
    if (cachedData !== undefined) {
      console.log(`🔄 Cache hit for key: ${key}`);
      return cachedData;
    }
    
    console.log(`🔍 Cache miss for key: ${key}`);
    const freshData = await callback();
    cache.set(key, freshData, ttl);
    return freshData;
  }
  
  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to store
   * @param {number} ttl - Time-to-live in seconds
   * @returns {boolean} Success status
   */
  static set(key, data, ttl = config.CACHE_TTL) {
    return cache.set(key, data, ttl);
  }
  
  /**
   * Invalidate cache for a key or pattern
   * @param {string} keyOrPattern - Cache key or pattern
   * @param {boolean} isPattern - If true, delete all keys matching pattern
   * @returns {number} Number of keys deleted
   */
  static invalidate(keyOrPattern, isPattern = false) {
    if (isPattern) {
      console.log(`🗑️ Invalidating cache pattern: ${keyOrPattern}`);
      const keys = cache.keys();
      const keysToDelete = keys.filter(key => key.includes(keyOrPattern));
      return cache.del(keysToDelete);
    } else {
      console.log(`🗑️ Invalidating cache key: ${keyOrPattern}`);
      return cache.del(keyOrPattern);
    }
  }
  
  /**
   * Flush all cache
   * @returns {boolean} Success status
   */
  static flushAll() {
    console.log('🧹 Flushing all cache');
    return cache.flushAll();
  }
}