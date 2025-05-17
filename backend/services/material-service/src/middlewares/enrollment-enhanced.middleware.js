import { EnrollmentIntegrationService } from '../services/enrollment-integration.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { Roles } from '../utils/rbac/roles.js';
import { CacheService } from '../services/cache.service.js';

/**
 * Configuration for enrollment check behavior
 * This could be moved to a config file or environment variable
 */
const ENROLLMENT_CHECK_CONFIG = {
  // If true, users can access materials even when enrollment check fails (service unavailable)
  // This is a fallback for service outages, not a bypass for enrollment checks
  ALLOW_ACCESS_ON_CHECK_FAILURE: true,
  
  // Time (in seconds) to cache a failed enrollment check
  FAILED_CHECK_CACHE_TTL: 300 // 5 minutes
};

/**
 * Enhanced middleware to verify if a user is enrolled in a course
 * Includes fallback behavior for service outages
 * Admins bypass this check
 */
export const verifyEnrollmentEnhanced = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Admin users bypass enrollment check
    if (userRole === Roles.ADMIN) {
      return next();
    }
      try {
      // Check if the user is enrolled in the course
      const isEnrolled = await EnrollmentIntegrationService.isUserEnrolled(userId, courseId);
      
      if (isEnrolled) {
        return next();
      }
      
      // User is not enrolled
      return res.status(403).json(
        ApiResponse.error('You are not enrolled in this course')
      );
    } catch (error) {
      // Service error occurred during enrollment check
      console.error(`Enrollment check failed for user ${userId}, course ${courseId}:`, error);
      
      // Check configuration for how to handle enrollment service failures
      if (ENROLLMENT_CHECK_CONFIG.ALLOW_ACCESS_ON_CHECK_FAILURE) {
        console.warn(`Allowing access to course ${courseId} for user ${userId} due to enrollment service failure`);
        
        // Cache this failure so we don't keep trying unsuccessful requests
        const cacheKey = `enrollment-check-failure:${userId}:${courseId}`;
        await CacheService.set(cacheKey, true, ENROLLMENT_CHECK_CONFIG.FAILED_CHECK_CACHE_TTL);
        
        // Allow access despite the failure
        return next();
      } else {
        // Configure to deny access when enrollment check fails
        return res.status(503).json(
          ApiResponse.error('Unable to verify course enrollment. Please try again later.')
        );
      }
    }
  } catch (error) {
    console.error('Error in enrollment verification middleware:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying course enrollment')
    );
  }
};
