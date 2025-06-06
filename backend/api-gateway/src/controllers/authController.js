import authCacheManager from '../utils/authCacheManager.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

/**
 * Middleware untuk menangani proses logout
 * - Menginvalidasi token di cache
 * - Menghapus cookie
 * - Menambahkan token ke blacklist
 */
export const handleLogout = async (req, res, next) => {
  try {
    // Ambil token dari cookie atau authorization header
    const token = req.cookies?.accessToken || 
      (req.headers.authorization?.startsWith('Bearer ') 
        ? req.headers.authorization.split(' ')[1] 
        : null);
    
    // Hapus cookie dengan nama yang benar
    res.clearCookie('access_token', {
      domain: process.env.COOKIE_DOMAIN,
      path: '/'
    });
    res.clearCookie('refresh_token', {
      domain: process.env.COOKIE_DOMAIN,
      path: '/'
    });
    
    // Jika tidak ada token, lanjut ke next middleware
    if (!token) {
      logger.info('Logout request with no token');
      return next();
    }
    
    await authCacheManager.blacklistToken(token);
    
    // Tambahkan data ke request untuk diproses oleh auth service
    req.logoutData = { token };
    
    logger.info(`User logged out: ${req.user?.id || 'unknown'}`);
    next();
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next();
  }
};

/**
 * Middleware khusus untuk menangani response login
 */
export const handleLoginResponse = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    try {
      const parsedBody = JSON.parse(body);
      
      // Jika login berhasil
      if (res.statusCode === 200 && 
          parsedBody.status === 'success' && 
          parsedBody.data?.accessToken &&
          parsedBody.data?.user) {
        
        const accessToken = parsedBody.data.accessToken;
        const refreshToken = parsedBody.data.refreshToken;
        const user = parsedBody.data.user;
        
        // Cache token dengan data user
        authCacheManager.cacheToken(accessToken, {
          id: user.id,
          role: user.role
        }).catch(err => logger.error(`Error caching login token: ${err.message}`));
        
        // Set access token cookie - GUNAKAN NAMA YANG SAMA
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          domain: process.env.COOKIE_DOMAIN,
          maxAge: config.REDIS.ttl.token * 1000,
          path: '/'
        });
        
        // Set refresh token cookie
        if (refreshToken) {
          res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
          });
        }
        
        logger.info(`User logged in: ${user.id}`);
      }
    } catch (error) {
      logger.error(`Error in handleLoginResponse middleware: ${error.message}`);
    }
    
    originalSend.apply(res, arguments);
  };
  
  next();
};

/**
 * Middleware untuk menangani refresh token
 * - Memeriksa apakah refresh token valid
 * - Menambahkan refresh token ke request body jika ada di cookie
 */
export const handleTokenRefresh = (req, res, next) => {
  try {
    // Jika refresh token ada di cookie, tambahkan ke body request
    if (req.cookies?.refreshToken && !req.body.refreshToken) {
      req.body.refreshToken = req.cookies.refreshToken;
    }
    
    // Lanjut ke auth service
    next();
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    next(error);
  }
};

/**
 * Middleware untuk menyimpan token baru ke cache setelah refresh
 * - Menambahkan token baru ke cache
 * - Meng-update cookies
 */
export const cacheNewToken = async (req, res, next) => {
  // Override metode send dari response
  const originalSend = res.send;
  
  res.send = function(body) {
    try {
      const parsedBody = JSON.parse(body);
      
      // Jika response berhasil dan berisi token baru
      if (res.statusCode === 200 && 
          parsedBody.status === 'success' && 
          parsedBody.data?.accessToken) {
        
        // Ambil token dan data user
        const newToken = parsedBody.data.accessToken;
        const refreshToken = parsedBody.data.refreshToken;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        
        // Jika ada data user, simpan ke cache
        if (userId && userRole) {
          authCacheManager.cacheToken(newToken, {
            id: userId,
            role: userRole
          }).catch(err => logger.error(`Error caching refreshed token: ${err.message}`));
          
          // Set cookie dengan token baru
          res.cookie('access_token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ubah ke production
            sameSite: 'lax',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: config.REDIS.ttl.token * 1000
          });
          
          // Set refresh token cookie jika ada
          if (refreshToken) {
            res.cookie('refresh_token', refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              domain: process.env.COOKIE_DOMAIN,
              maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
          }
        }
      }
    } catch (error) {
      logger.error(`Error in cacheNewToken middleware: ${error.message}`);
    }
    
    // Panggil metode send asli
    originalSend.apply(res, arguments);
  };
  
  next();
};