import { z } from 'zod';
import { ApiResponse } from './api-response.js';

/**
 * Validate request data with Zod schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

// Course creation schema
const courseCreationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  quota: z.number().int().positive().optional()
});

// Course update schema
const courseUpdateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(20, 'Description must be at least 20 characters').optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  quota: z.number().int().positive().optional()
});

export const validateCourseCreation = validate(courseCreationSchema);
export const validateCourseUpdate = validate(courseUpdateSchema);