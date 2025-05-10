/**
 * Standardized API response format
 */
export class ApiResponse {
  /**
   * Create a success response
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @returns {Object} Formatted success response
   */
  static success(message = 'Operation successful', data = null) {
    return {
      status: 'success',
      message,
      data
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {any} errors - Error details
   * @returns {Object} Formatted error response
   */
  static error(message = 'An error occurred', errors = null) {
    return {
      status: 'error',
      message,
      errors
    };
  }

  /**
   * Create a pagination response
   * @param {Array} data - Data items
   * @param {number} total - Total number of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {string} message - Success message
   * @returns {Object} Formatted pagination response
   */
  static paginate(data, total, page, limit, message = 'Data retrieved successfully') {
    const totalPages = Math.ceil(total / limit);
    
    return {
      status: 'success',
      message,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
}
