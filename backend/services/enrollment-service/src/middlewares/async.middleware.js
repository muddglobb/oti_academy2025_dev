/**
 * Async error handler middleware
 * Wraps async route handlers to remove try/catch boilerplate and forward errors to error middleware
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
