import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`[ERROR] ${err.stack || err}`);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 handler middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found - ${req.originalUrl}`
  });
};