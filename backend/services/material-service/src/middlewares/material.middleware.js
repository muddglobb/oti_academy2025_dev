import { z } from 'zod';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Validate material creation data
 */
export const validateMaterialData = (req, res, next) => {
  try {
    // Define schema based on material type
    const commonSchema = {
      title: z.string().min(3, 'Title must be at least 3 characters').max(255),
      description: z.string().optional(),
      type: z.enum(['TEXT', 'PDF', 'VIDEO', 'LINK', 'QUIZ', 'CODE']),
      sectionId: z.string().uuid('Invalid section ID'),
      order: z.number().int().nonnegative().optional()
    };

    // Additional fields based on type
    let schema;
    
    switch (req.body.type) {
      case 'TEXT':
        schema = z.object({
          ...commonSchema,
          content: z.string().min(1, 'Content is required for TEXT type')
        });
        break;
      case 'PDF':
        // For PDF we'll validate file in upload middleware
        schema = z.object({
          ...commonSchema,
          fileUrl: z.string().optional() // May be populated by upload middleware
        });
        break;
      case 'VIDEO':
        schema = z.object({
          ...commonSchema,
          externalUrl: z.string().url('Invalid video URL').optional(),
          fileUrl: z.string().optional(),
          duration: z.number().int().positive().optional()
        }).refine(data => data.externalUrl || data.fileUrl, {
          message: 'Either externalUrl or fileUrl must be provided for VIDEO type'
        });
        break;
      case 'LINK':
        schema = z.object({
          ...commonSchema,
          externalUrl: z.string().url('Invalid URL')
        });
        break;
      case 'QUIZ':
        schema = z.object({
          ...commonSchema,
          content: z.string().min(1, 'Quiz content is required')
        });
        break;
      case 'CODE':
        schema = z.object({
          ...commonSchema,
          content: z.string().min(1, 'Code content is required')
        });
        break;
      default:
        schema = z.object(commonSchema);
    }

    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

/**
 * Validate section creation data
 */
export const validateSectionData = (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters').max(255),
      description: z.string().optional(),
      courseId: z.string().uuid('Invalid course ID'),
      order: z.number().int().nonnegative().optional()
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

/**
 * Verify if section exists and belongs to a course
 */
export const verifySectionExists = async (req, res, next) => {
  try {
    const sectionId = req.params.id || req.body.sectionId;
    
    if (!sectionId) {
      return res.status(400).json(
        ApiResponse.error('Section ID is required')
      );
    }

    const section = await prisma.section.findUnique({
      where: { id: sectionId }
    });
    
    if (!section) {
      return res.status(404).json(
        ApiResponse.error('Section not found')
      );
    }

    // Add section to request for later use
    req.section = section;
    next();
  } catch (error) {
    console.error('Error verifying section:', error);
    return res.status(500).json(
      ApiResponse.error('Internal server error during section verification')
    );
  }
};