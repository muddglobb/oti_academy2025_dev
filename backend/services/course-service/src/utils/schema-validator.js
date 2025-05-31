/**
 * Schema-based validation utility for complete data isolation
 * Ensures no direct data flow from HTTP requests to database operations
 */

import { isValidUUID } from './validators.js';

/**
 * Session data schema with strict validation rules
 */
const sessionSchema = {
  courseId: {
    required: true,
    type: 'uuid',
    validate: (value) => isValidUUID(value),
    sanitize: (value) => String(value).trim()
  },
  startAt: {
    required: true,
    type: 'date',
    validate: (value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    },
    sanitize: (value) => new Date(value)
  },
  durationHrs: {
    required: false,
    type: 'number',
    default: 2,
    validate: (value) => {
      const num = parseInt(value, 10);
      return !Number.isNaN(num) && num > 0 && num <= 24;
    },
    sanitize: (value) => parseInt(String(value), 10)
  },
  description: {
    required: false,
    type: 'string',
    validate: (value) => typeof value === 'string',
    sanitize: (value) => String(value).trim().substring(0, 1000)
  }
};

/**
 * Update session schema (all fields optional except validation rules)
 */
const updateSessionSchema = {
  startAt: sessionSchema.startAt,
  durationHrs: sessionSchema.durationHrs,
  description: sessionSchema.description
};

/**
 * Validates and sanitizes data according to schema
 * Creates completely new object with no reference to original data
 * @param {Object} rawData - Raw input data
 * @param {Object} schema - Validation schema
 * @param {boolean} requireAtLeastOne - Require at least one field for updates
 * @returns {Object} - { isValid, errors, sanitizedData }
 */
export function validateAndSanitize(rawData, schema, requireAtLeastOne = false) {
  const errors = [];
  const sanitizedData = {};
  let hasValidField = false;

  // Process each schema field
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const rawValue = rawData[fieldName];
    const hasValue = rawData.hasOwnProperty(fieldName);

    // Check required fields
    if (fieldSchema.required && (!hasValue || rawValue === undefined || rawValue === null)) {
      errors.push(`${fieldName} is required`);
      continue;
    }

    // Skip optional fields that are not provided
    if (!hasValue) {
      // Use default value if available
      if (fieldSchema.default !== undefined) {
        sanitizedData[fieldName] = fieldSchema.default;
        hasValidField = true;
      }
      continue;
    }

    // Validate the field value
    if (!fieldSchema.validate(rawValue)) {
      errors.push(`${fieldName} is invalid`);
      continue;
    }

    // Sanitize and create new value (breaks data flow connection)
    try {
      const sanitizedValue = fieldSchema.sanitize(rawValue);
      
      // Double-check UUID fields for extra security
      if (fieldSchema.type === 'uuid' && !isValidUUID(sanitizedValue)) {
        errors.push(`${fieldName} must be a valid UUID`);
        continue;
      }
      
      // Create completely new value based on type to break any reference
      switch (fieldSchema.type) {
        case 'uuid':
          sanitizedData[fieldName] = String(sanitizedValue);
          break;
        case 'date':
          sanitizedData[fieldName] = new Date(sanitizedValue.getTime());
          break;
        case 'number':
          sanitizedData[fieldName] = Number(sanitizedValue);
          break;
        case 'string':
          sanitizedData[fieldName] = String(sanitizedValue);
          break;
        default:
          sanitizedData[fieldName] = sanitizedValue;
      }
      
      hasValidField = true;
    } catch (error) {
      errors.push(`${fieldName} sanitization failed`);
    }
  }

  // Check if at least one field is required
  if (requireAtLeastOne && !hasValidField) {
    errors.push('At least one valid field is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

/**
 * Validates session creation data
 * @param {Object} rawData - Raw request data
 * @returns {Object} - Validation result
 */
export function validateSessionCreate(rawData) {
  return validateAndSanitize(rawData, sessionSchema, false);
}

/**
 * Validates session update data
 * @param {Object} rawData - Raw request data
 * @returns {Object} - Validation result
 */
export function validateSessionUpdate(rawData) {
  return validateAndSanitize(rawData, updateSessionSchema, true);
}
