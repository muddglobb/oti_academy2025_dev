import { ApiResponse } from '../utils/api-response.js';

/**
 * Validate request using Joi schema
 * @param {Object} schema - Joi schema
 * @param {String} property - Request property to validate (body, params, query)
 * @returns {Function} Express middleware
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (!error) {
      return next();
    }
    
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json(
      ApiResponse.error('Validation error', errors)
    );
  };
};