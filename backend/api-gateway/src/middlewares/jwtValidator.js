import jwt from 'jsonwebtoken';
import redisClient from '../utils/redisClient.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Middleware untuk validasi JWT
 */
export const jwtValidatorMiddleware = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Check if auth header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. No token provided.'
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];
  
  try {
    // 1. Check if token is in Redis cache
    const redisKey = `${config.REDIS.keyPrefix}jwt:${token}`;
    
    try {
      const cachedUserData = await redisClient.get(redisKey);
      
      if (cachedUserData) {
        // Token found in cache, use cached data
        req.user = JSON.parse(cachedUserData);
        return next();
      }
    } catch (redisError) {
      // Redis operation failed - log error but continue with normal JWT verification
      logger.error(`Redis error in JWT validation: ${redisError.message}`);
    }
    
    // 2. If not in Redis, verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    // 3. Store in Redis for future use with TTL 1 hour
    try {
      // Using set with EX option instead of setEx
      await redisClient.set(
        redisKey, 
        JSON.stringify(req.user),
        'EX', 
        config.REDIS.ttl.token
      );
    } catch (redisError) {
      // Log Redis error but continue processing
      logger.error(`Failed to cache JWT: ${redisError.message}`);
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware untuk validasi JWT opsional - tidak error jika tidak ada token
 */
export const optionalJwtValidator = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Jika tidak ada auth header, lanjutkan tanpa user info
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Check if token is in Redis cache
    const redisKey = `${config.REDIS.keyPrefix}jwt:${token}`;
    
    try {
      const cachedUserData = await redisClient.get(redisKey);
      
      if (cachedUserData) {
        // Token found in cache, use cached data
        req.user = JSON.parse(cachedUserData);
        return next();
      }
    } catch (redisError) {
      // Redis operation failed - log error but continue with normal JWT verification
      logger.error(`Redis error in optional JWT validation: ${redisError.message}`);
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    // Store in Redis for future use
    try {
      // Using set with EX option instead of setEx
      await redisClient.set(
        redisKey, 
        JSON.stringify(req.user),
        'EX', 
        config.REDIS.ttl.token
      );
    } catch (redisError) {
      // Log Redis error but continue processing
      logger.error(`Failed to cache JWT: ${redisError.message}`);
    }
    
    next();
  } catch (error) {
    // Token tidak valid, tapi tetap lanjutkan tanpa user info
    next();
  }
};