/**
 * Utility class for standardized API responses across OTI Academy services
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

  /**
   * Create a paginated response
   * @param {Array} data - Data array
   * @param {number} total - Total number of records
   * @param {number} page - Current page number
   * @param {number} limit - Records per page
   * @param {string} message - Success message
   * @returns {Object} Formatted pagination response
   */
  static paginate(data, total, page, limit, message = 'Data retrieved successfully') {
    return {
      status: 'success',
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
}