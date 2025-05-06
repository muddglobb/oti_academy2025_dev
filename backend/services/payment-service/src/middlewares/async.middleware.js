/**
 * Async middleware wrapper to catch errors and pass them to the error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};