/**
 * Utility class for standardized API responses
 */
export class ApiResponse {
    /**
     * Create a success response
     * @param {*} data - Response data
     * @param {string} message - Success message
     * @returns {Object} Formatted success response
     */
    static success(data, message = 'Success') {
      return {
        status: 'success',
        message,
        data
      };
    }
  
    /**
     * Create an error response
     * @param {string} message - Error message
     * @param {*} errors - Optional error details
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