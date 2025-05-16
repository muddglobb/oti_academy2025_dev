import { EnrollmentIntegrationService } from '../services/enrollment-integration.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { Roles } from '../utils/rbac/roles.js';

/**
 * Middleware to verify if a user is enrolled in a course
 * Admins bypass this check
 */
export const verifyEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Admin users bypass enrollment check
    if (userRole === Roles.ADMIN) {
      return next();
    }
    
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
    console.error('Error verifying enrollment:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying course enrollment')
    );
  }
};
