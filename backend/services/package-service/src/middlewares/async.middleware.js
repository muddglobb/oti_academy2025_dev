/**
 * Async handler untuk menghindari pengulangan try-catch pada route handlers
 * @param {Function} fn - Fungsi async yang akan dibungkus
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};