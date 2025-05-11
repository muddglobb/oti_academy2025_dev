import logger from '../utils/logger.js';
import config from '../config/index.js';

/**
 * Middleware to handle errors
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

/**
 * Middleware to validate API key
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  
  // Skip API key validation in development mode if using default key
  if (process.env.NODE_ENV === 'development' && config.apiKey === 'default-api-key-for-dev-only') {
    return next();
  }
  
  if (!apiKey || apiKey !== config.apiKey) {
    logger.warn('Invalid API key attempt', { 
      ip: req.ip, 
      path: req.path,
      method: req.method
    });
    
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key',
    });
    return;
  }
  
  next();
};
