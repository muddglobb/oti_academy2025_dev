/**
 * Utility for URL validation
 */

/**
 * Validates if a string is a proper URL
 * Accepts http, https protocols and common file storage domains
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidFileUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const urlObj = new URL(url);
    
    // Check protocol (must be http or https)
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Verify the hostname has a valid structure (at least one dot and no empty parts)
    const domainParts = urlObj.hostname.split('.');
    if (domainParts.length < 2 || domainParts.some(part => part === '')) {
      return false;
    }
    
    return true;
  } catch (e) {
    // URL constructor will throw for invalid URLs
    return false;
  }
};

/**
 * Gets a user-friendly error message for an invalid URL
 * @param {string} url - The invalid URL
 * @returns {string} Error message
 */
export const getUrlValidationError = (url) => {
  if (!url || typeof url !== 'string') {
    return 'File URL is empty or not a string';
  }
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return 'File URL must use HTTP or HTTPS protocol';
    }
    
    // Check domain structure
    const domainParts = urlObj.hostname.split('.');
    if (domainParts.length < 2 || domainParts.some(part => part === '')) {
      return 'Invalid domain structure in URL';
    }
    
    return 'Invalid file URL format';
  } catch (e) {
    return 'File URL is not a valid URL';
  }
};
