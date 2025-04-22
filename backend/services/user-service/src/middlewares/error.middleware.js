import logger from '../utils/logger.js';
import { ApiResponse } from '../utils/api-response.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);
  
  // Prisma specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json(
        ApiResponse.error('A record with this data already exists')
      );
    }
    if (err.code === 'P2025') {
      return res.status(404).json(
        ApiResponse.error('Record not found')
      );
    }
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return res.status(statusCode).json(
    ApiResponse.error(
      message,
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
};