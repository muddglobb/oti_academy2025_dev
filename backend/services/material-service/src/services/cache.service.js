import { getCache, setCache, deleteCache, deletePattern } from '../utils/redisClient.js';
import config from '../config/index.js';

/**
 * Service untuk menangani caching data material menggunakan Redis
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
      const cachedData = await getCache(key);
      
      if (cachedData) {
        console.log(`🔄 Cache hit for ${key}`);
        return cachedData;
      }
      
      console.log(`🔍 Cache miss for ${key}, fetching fresh data`);
      
      // If cache miss, execute callback to get fresh data
      const freshData = await callback();
      
      // Store result in cache with TTL
      await setCache(key, freshData, ttl);
      
      return freshData;
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error.message);
      // If cache fails, still return fresh data
      return await callback();
    }
  }
  
  /**
   * Menyimpan data ke cache
   * @param {string} key - Cache key
   * @param {any} data - Data yang akan disimpan
   * @param {number} ttl - Time-to-live dalam detik
   * @returns {Promise<boolean>} Status berhasil
   */
  static async set(key, data, ttl = 3600) {
    try {
      console.log(`💾 Setting cache for key: ${key}`);
      return await setCache(key, data, ttl);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error.message);
      return false;
    }
  }
  
  /**
   * Mendapatkan data dari cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Data dari cache atau null
   */
  static async get(key) {
    try {
      return await getCache(key);
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error.message);
      return null;
    }
  }
  
  /**
   * Menghapus cache untuk sebuah key atau pattern
   * @param {string} keyOrPattern - Cache key atau pattern (dengan *)
   * @param {boolean} isPattern - Apakah key adalah pattern
   * @returns {Promise<number>} Jumlah key yang dihapus
   */
  static async invalidate(keyOrPattern, isPattern = false) {
    try {
      if (isPattern) {
        console.log(`🗑️ Invalidating cache pattern: ${keyOrPattern}`);
        return await deletePattern(keyOrPattern);
      } else {
        console.log(`🗑️ Invalidating cache key: ${keyOrPattern}`);
        const success = await deleteCache(keyOrPattern);
        return success ? 1 : 0;
      }
    } catch (error) {
      console.error(`Cache invalidate error for ${keyOrPattern}:`, error.message);
      return 0;
    }
  }
  
  /**
   * Flush semua cache (gunakan dengan hati-hati)
   * @returns {Promise<boolean>} Status berhasil
   */
  static async flushAll() {
    try {
      console.log('🧹 Flushing all material cache');
      // Redis flushall bisa berbahaya, jadi kita hapus pattern tertentu saja
      const patterns = [
        'material:*',
        'course:*:materials',
        'all:materials'
      ];
      
      let totalDeleted = 0;
      for (const pattern of patterns) {
        const deleted = await deletePattern(pattern);
        totalDeleted += deleted;
      }
      
      console.log(`🧹 Flushed ${totalDeleted} cache keys`);
      return totalDeleted > 0;
    } catch (error) {
      console.error('Cache flush error:', error.message);
      return false;
    }
  }
}