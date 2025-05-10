/**
 * Custom error class for API errors
 */
class ApiError extends Error {
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
const badRequest = (message = 'Bad Request') => {
  return new ApiError(400, message);
};

/**
 * Create a 401 Unauthorized error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const unauthorized = (message = 'Unauthorized') => {
  return new ApiError(401, message);
};

/**
 * Create a 403 Forbidden error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const forbidden = (message = 'Forbidden') => {
  return new ApiError(403, message);
};

/**
 * Create a 404 Not Found error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const notFound = (message = 'Resource not found') => {
  return new ApiError(404, message);
};

/**
 * Create a 409 Conflict error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const conflict = (message = 'Resource conflict') => {
  return new ApiError(409, message);
};

/**
 * Create a 500 Internal Server Error
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const internal = (message = 'Internal Server Error') => {
  return new ApiError(500, message, true);
};

module.exports = {
  ApiError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internal
};
