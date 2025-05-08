import redisClient from './redisClient.js';
import config from '../config/index.js';
import logger from './logger.js';

/**
 * Auth Cache Manager
 * Mengelola token JWT dalam Redis cache
 */
class AuthCacheManager {
  /**
   * Simpan token dalam cache
   * @param {string} token - JWT token
   * @param {object} userData - Data user yang diperoleh dari JWT
   */
  async cacheToken(token, userData) {
    try {
      if (!redisClient.isOpen) {
        return false;
      }
      
      // Hash token untuk menggunakannya sebagai key
      const tokenKey = `${config.REDIS.keyPrefix}token:${this.hashToken(token)}`;
      
      // Simpan data user dengan TTL
      await redisClient.set(
        tokenKey,
        JSON.stringify(userData),
        'EX',
        config.REDIS.ttl.token
      );
      
      return true;
    } catch (error) {
      logger.error(`Failed to cache token: ${error.message}`);
      return false;
    }
  }

  /**
   * Dapatkan data user dari token yang di-cache
   * @param {string} token - JWT token
   * @returns {object|null} User data atau null jika tidak ditemukan
   */
  async getUserFromCachedToken(token) {
    try {
      if (!redisClient.isOpen) {
        return null;
      }
      
      const tokenKey = `${config.REDIS.keyPrefix}token:${this.hashToken(token)}`;
      const userData = await redisClient.get(tokenKey);
      
      if (!userData) {
        return null;
      }
      
      return JSON.parse(userData);
    } catch (error) {
      logger.error(`Failed to get user from cached token: ${error.message}`);
      return null;
    }
  }

  /**
   * Tambahkan token ke blacklist (saat logout)
   * @param {string} token - JWT token to blacklist
   * @param {number} expirySeconds - Seconds until token expiry
   * @returns {boolean} Success status
   */
  async blacklistToken(token, expirySeconds = null) {
    try {
      if (!redisClient.isOpen) {
        return false;
      }
      
      // Hapus token dari cache (menghapus session aktif)
      const tokenKey = `${config.REDIS.keyPrefix}token:${this.hashToken(token)}`;
      await redisClient.del(tokenKey);
      
      // Tambahkan token ke blacklist
      const blacklistKey = `${config.REDIS.keyPrefix}blacklist:${this.hashToken(token)}`;
      
      // Gunakan TTL dari config atau sisa waktu token
      const ttl = expirySeconds || config.REDIS.ttl.blacklist;
      
      await redisClient.set(blacklistKey, '1', 'EX', ttl);
      
      return true;
    } catch (error) {
      logger.error(`Failed to blacklist token: ${error.message}`);
      return false;
    }
  }

  /**
   * Periksa apakah token ada dalam blacklist
   * @param {string} token - JWT token to check
   * @returns {boolean} True jika token di-blacklist
   */
  async isTokenBlacklisted(token) {
    try {
      if (!redisClient.isOpen) {
        return false;
      }
      
      const blacklistKey = `${config.REDIS.keyPrefix}blacklist:${this.hashToken(token)}`;
      const exists = await redisClient.exists(blacklistKey);
      
      return exists === 1;
    } catch (error) {
      logger.error(`Failed to check blacklisted token: ${error.message}`);
      return false;
    }
  }

  /**
   * Hash token untuk menciptakan key yang aman
   * @param {string} token - JWT token
   * @returns {string} Hashed token
   */
  hashToken(token) {
    // Menggunakan substring dari token untuk key
    // Dalam implementasi produksi lebih baik menggunakan crypto
    return token.slice(-32);
  }
}

export default new AuthCacheManager();