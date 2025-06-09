import { getCache, setCache, deleteCache, deletePattern } from '../utils/redisClient.js';

/**
 * Service untuk menangani caching data course
 */
export class CacheService {
  /**
   * Mendapatkan cache untuk sebuah key, atau menyimpan hasil dari callback jika cache tidak ada
   * @param {string} key - Cache key
   * @param {Function} callback - Async function yang akan dipanggil jika cache tidak ada
   * @param {number} ttl - Time-to-live dalam detik
   * @returns {Promise<any>} Data dari cache atau hasil callback
   */  static async getOrSet(key, callback, ttl = 7200) {
    try {
      // Try to get data from cache first
      const cachedData = await getCache(key);
      
      if (cachedData) {
        return cachedData;
      }
      
      // Execute callback to get fresh data
      const freshData = await callback();
      
      // Store result in cache with TTL
      await setCache(key, freshData, ttl);
      
      return freshData;
    } catch (error) {
      console.error(`Cache error for key ${key}: ${error.message}`);
      
      // Fallback to callback without cache
      return callback();
    }
  }

  /**
   * **TAMBAHAN: Method set untuk menyimpan data ke cache**
   * @param {string} key - Cache key
   * @param {any} data - Data yang akan disimpan
   * @param {number} ttl - Time-to-live dalam detik
   * @returns {Promise<boolean>} Status keberhasilan operasi
   */
  static async set(key, data, ttl = 7200) {
    try {
      return await setCache(key, data, ttl);
    } catch (error) {
      console.error(`Cache set error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * **TAMBAHAN: Method get untuk mengambil data dari cache**
   * @param {string} key - Cache key
   * @returns {Promise<any>} Data dari cache atau null
   */
  static async get(key) {
    try {
      return await getCache(key);
    } catch (error) {
      console.error(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Menghapus cache untuk sebuah key atau pattern
   * @param {string} keyOrPattern - Cache key atau pattern (dengan *)
   * @param {boolean} isPattern - Apakah key adalah pattern
   * @returns {Promise<boolean>} Success status
   */  static async invalidate(keyOrPattern, isPattern = false) {
    try {
      if (isPattern) {
        return await deletePattern(keyOrPattern);
      } else {
        return await deleteCache(keyOrPattern);
      }
    } catch (error) {
      console.error(`Cache invalidation error: ${error.message}`);
      return false;
    }
  }
}