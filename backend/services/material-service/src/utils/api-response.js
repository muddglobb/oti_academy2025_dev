/**
 * Utility class for consistent API responses
 */
export class ApiResponse {
  /**
   * Create success response with optional data and message
   * @param {*} data - Data to include in response
   * @param {string} message - Optional success message
   * @returns {Object} Formatted response object
   */
  static success(data = null, message = 'Success') {
    return {
      status: 'success',
      message,
      data
    };
  }
  
  /**
   * Create error response with message and optional error details
   * @param {string} message - Error message
   * @param {*} errors - Additional error details (optional)
   * @returns {Object} Formatted response object
   */
  static error(message = 'Error occurred', errors = null) {
    return {
      status: 'error',
      message,
      errors
    };
  }
}