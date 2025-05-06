/**
 * API Response formatter utility
 */
export class ApiResponse {
  /**
   * Success response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Formatted response object
   */
  static success(data, message = 'Success') {
    return {
      status: 'success',
      message,
      data
    };
  }
  
  /**
   * Error response
   * @param {string} message - Error message
   * @returns {Object} Formatted error response object
   */
  static error(message) {
    return {
      status: 'error',
      message
    };
  }
}