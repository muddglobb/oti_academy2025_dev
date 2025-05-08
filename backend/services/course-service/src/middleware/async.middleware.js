/**
 * Async handler to avoid try-catch repetition in route handlers
 * @param {Function} fn - Async function to be wrapped
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };