import { MaterialService } from '../services/material.service.js';
import { EnrollmentIntegrationService } from '../services/enrollment-integration.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { Roles } from '../utils/rbac/roles.js';

/**
 * Middleware to verify if a user is enrolled in a course for a specific material
 * Admins bypass this check
 */
export const verifyMaterialEnrollment = async (req, res, next) => {
  try {
    const { id: materialId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Admin users bypass enrollment check
    if (userRole === Roles.ADMIN) {
      return next();
    }
    
    // Get the material to find its course
    const material = await MaterialService.getMaterialById(materialId);
    
    if (!material) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }
    
    const { courseId } = material;
    
    // Check if the user is enrolled in the course
    const isEnrolled = await EnrollmentIntegrationService.isUserEnrolled(userId, courseId);
    
    if (!isEnrolled) {
      return res.status(403).json(
        ApiResponse.error('You are not enrolled in this course')
      );
    }
    
    // User is enrolled, proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error('Error verifying material enrollment:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying course enrollment')
    );
  }
};
