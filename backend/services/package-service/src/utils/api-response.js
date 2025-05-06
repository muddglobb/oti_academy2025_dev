/**
 * Utility class untuk memformat respons API secara konsisten.
 */
export class ApiResponse {
  /**
   * Membuat respons sukses dengan data opsional dan pesan
   * @param {*} data - Data yang ingin disertakan dalam respons
   * @param {string} message - Pesan sukses opsional
   * @returns {Object} Objek respons terformat
   */
  static success(data = null, message = 'Success') {
    return {
      status: 'success',
      message,
      data
    };
  }
  
  /**
   * Membuat respons error dengan pesan dan data error opsional
   * @param {string} message - Pesan error
   * @param {*} errors - Data error tambahan (opsional)
   * @returns {Object} Objek respons terformat
   */
  static error(message = 'Error occurred', errors = null) {
    return {
      status: 'error',
      message,
      errors
    };
  }
}