/**
 * API Response formatter utility
 */
export class ApiResponse {
  /**
   * Success response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {any} meta - Additional metadata (like paymentCounts)
   * @returns {Object} Formatted response object
   */
  static success(data, message = 'Success', meta = null) {
    const response = {
      status: 'success',
      message,
      data
    };
    
    // Add meta information if provided
    if (meta) {
      response.meta = meta;
    }
    
    return response;
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