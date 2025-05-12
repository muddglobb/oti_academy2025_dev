/**
 * Custom error class for API errors in Assignment Service
 */
export class ApiError extends Error {
  /**
   * Create a new API error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {boolean} isOperational - Whether this is an operational error (vs programmer error)
   * @param {string} stack - Optional stack trace
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Create a 400 Bad Request error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const badRequest = (message = 'Bad Request') => {
  return new ApiError(400, message);
};

/**
 * Create a 401 Unauthorized error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const unauthorized = (message = 'Unauthorized') => {
  return new ApiError(401, message);
};

/**
 * Create a 403 Forbidden error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const forbidden = (message = 'Forbidden') => {
  return new ApiError(403, message);
};

/**
 * Create a 404 Not Found error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const notFound = (message = 'Resource not found') => {
  return new ApiError(404, message);
};

/**
 * Create a 409 Conflict error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const conflict = (message = 'Resource conflict') => {
  return new ApiError(409, message);
};

/**
 * Create a 500 Internal Server Error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const internal = (message = 'Internal Server Error') => {
  return new ApiError(500, message);
};

/**
 * Create a 422 Validation Error
 * @param {string} message - Error message
 * @param {Array} errors - Validation errors
 * @returns {ApiError}
 */
export const validationError = (message = 'Validation failed', errors = []) => {
  const error = new ApiError(422, message);
  error.errors = errors;
  return error;
};

/**
 * Create a 429 Too Many Requests error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
export const tooManyRequests = (message = 'Too many requests, please try again later') => {
  return new ApiError(429, message);
};

/**
 * Error handler for use with Express
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorData = null;
  
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.errors) {
      errorData = err.errors;
    }
  }
  
  res.status(statusCode).json({
    status: 'error',
    message,
    errors: errorData,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Async error wrapper to avoid try-catch blocks
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};