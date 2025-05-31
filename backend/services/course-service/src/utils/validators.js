/**
 * Validation utilities for Course Service
 */

/**
 * Validate UUID format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid UUID
 */
export const isValidUUID = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Sanitize and validate ID parameter
 * @param {string} id - Raw ID from request
 * @returns {string|null} Sanitized ID or null if invalid
 */
export const sanitizeAndValidateId = (id) => {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  // Trim whitespace and convert to lowercase for UUID validation
  const sanitizedId = id.trim().toLowerCase();
  
  // Validate UUID format
  if (!isValidUUID(sanitizedId)) {
    return null;
  }
  
  return sanitizedId;
};

/**
 * Get validation error message for invalid ID
 * @param {string} resourceType - Type of resource (e.g., 'session', 'course')
 * @returns {string} Error message
 */
export const getInvalidIdMessage = (resourceType = 'resource') => {
  return `Invalid ${resourceType} ID format. Expected valid UUID.`;
};
