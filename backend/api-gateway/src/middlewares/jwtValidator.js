import jwt from 'jsonwebtoken';
import redisClient from '../utils/redisClient.js';
import authCacheManager from '../utils/authCacheManager.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Middleware untuk validasi JWT dari HTTP-only cookie atau Authorization header
 * dengan menggunakan cache untuk meningkatkan performa
 */
export const jwtValidatorMiddleware = async (req, res, next) => {
  // Pertama cek apakah token ada di cookie (prioritas utama)
  let token = req.cookies?.access_token;
  
  // Jika tidak ada di cookie, coba ambil dari header
  if (!token) {
    const authHeader = req.headers.authorization;
    
    // Jika tidak ada auth header juga, kembalikan error
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. No valid token provided.'
      });
    }
    
    token = authHeader.split(' ')[1];
  }
  
  try {
    // 1. Cek apakah token ada di blacklist
    const isBlacklisted = await authCacheManager.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({
        status: 'error',
        message: 'Token has been revoked. Please login again.'
      });
    }
    
    // 2. Cek apakah token ada di cache Redis
    const cachedUserData = await authCacheManager.getUserFromCachedToken(token);
    if (cachedUserData) {
      // Token ditemukan di cache, gunakan data dari cache
      req.user = cachedUserData;
      return next();
    }
    
    // 3. Jika tidak ada di cache, verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data di request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    // 4. Simpan di cache untuk penggunaan selanjutnya
    await authCacheManager.cacheToken(token, req.user);
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error', 
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

/**
 * Middleware untuk validasi JWT opsional - tidak error jika tidak ada token
 */
export const optionalJwtValidator = async (req, res, next) => {
  // Pertama cek apakah token ada di cookie (prioritas utama)
  let token = req.cookies?.access_token;
  
  // Jika tidak ada di cookie, coba ambil dari header
  if (!token) {
    const authHeader = req.headers.authorization;
    
    // Jika tidak ada auth header juga, lanjutkan tanpa user info
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    token = authHeader.split(' ')[1];
  }

  try {
    // 1. Cek apakah token ada di blacklist
    const isBlacklisted = await authCacheManager.isTokenBlacklisted(token);
    if (isBlacklisted) {
      // Token di blacklist, tetapi karena ini optional, lanjutkan tanpa user
      return next();
    }
    
    // 2. Cek apakah token ada di cache Redis
    const cachedUserData = await authCacheManager.getUserFromCachedToken(token);
    if (cachedUserData) {
      // Token ditemukan di cache, gunakan data dari cache
      req.user = cachedUserData;
      return next();
    }
    
    // 3. Jika tidak ada di cache, verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data di request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    // 4. Simpan di cache untuk penggunaan selanjutnya
    await authCacheManager.cacheToken(token, req.user);
    
    next();
  } catch (error) {
    // Token tidak valid, tapi tetap lanjutkan tanpa user info
    next();
  }
};