import { z } from 'zod';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Validate material creation and update data
 * Note: unlockDate should be provided in WIB timezone (UTC+7)
 */
export const validateMaterialData = (req, res, next) => {
  try {
    // Simple schema for Material model
    const materialSchema = z.object({
      courseId: z.string().uuid('Invalid course ID'),
      title: z.string().min(3, 'Title must be at least 3 characters').max(255),
      description: z.string().optional(),
      resourceUrl: z.string().url('Resource URL must be a valid URL'),
      unlockDate: z.string().refine(
        (value) => {
          try {
            // The date should be parsable
            const dateObj = new Date(value);
            const isValidDate = !isNaN(dateObj.getTime());
            
            // Additionally, we could add more specific validations for WIB format if needed
            
            return isValidDate;
          } catch (e) {
            return false;
          }
        },
        { message: 'Invalid date format for unlockDate. Expected format: YYYY-MM-DDTHH:MM:SS (in WIB timezone)' }
      )
    });

    // For update requests, all fields are optional
    const schema = req.method === 'PUT' 
      ? materialSchema.partial() // Make all fields optional for updates
      : materialSchema;          // Keep required fields for creation

    // Validate request body
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json(
        ApiResponse.error('Invalid material data', errors)
      );
    }

    // Add a note to the request to indicate that date conversion is needed
    if (req.body.unlockDate) {
      req.needsDateConversion = true;
    }

    next();
  } catch (error) {
    console.error('Error validating material data:', error);
    res.status(500).json(
      ApiResponse.error('Server error validating material data')
    );
  }
};
