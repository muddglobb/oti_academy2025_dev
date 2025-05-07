/**
 * Standard API response formatter for OTI Academy
 */
export class ApiResponse {
  /**
   * Create success response
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
   * Create error response
   * @param {string} message - Error message
   * @param {any} errors - Optional detailed errors
   * @returns {Object} Formatted error response
   */
  static error(message = 'An error occurred', errors = null) {
    const response = {
      status: 'error',
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
  }
}