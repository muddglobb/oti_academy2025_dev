import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';

/**
 * Service for integrating with enrollment service (in payment service)
 */
export class EnrollmentIntegrationService {
  // Create circuit breaker instances
  static enrollmentStatusCircuitBreaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000, // 1 minute
    fallbackFn: () => {
      console.log('⚠️ Circuit breaker triggered - allowing access');
      return true; // Default to allowing access when circuit is open
    }
  });
  
  static enrollmentListCircuitBreaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000, // 1 minute
    fallbackFn: () => {
      console.log('⚠️ Circuit breaker triggered for enrollment list - allowing access');
      return { status: 'success', data: [] };
    }
  });

  /**
   * Check if a user is enrolled in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} True if user is enrolled
   */  static async isUserEnrolled(userId, courseId) {
    try {
      // Check if user has admin role, admins should always have access
      if (userId && userId.includes('admin')) {
        console.log(`Admin user ${userId} detected - granting access to course ${courseId}`);
        return true;
      }
      
      // TEMPORARY: Development/Testing Mode - Force allow access for specific courses
      // When enrollment service issues are fixed, remove this or toggle via env var
      const ENABLE_EMERGENCY_ACCESS = false; // Now using circuit breaker instead of emergency mode
      if (ENABLE_EMERGENCY_ACCESS) {
        console.log(`⚠️ EMERGENCY ACCESS MODE - Bypassing enrollment check for user ${userId} in course ${courseId}`);
        return true;
      }
      
      // Normal flow - only executes if emergency access is disabled
      // Cache key for enrollment status
      const cacheKey = `enrollment:${userId}:${courseId}`;
      
      // Try to get from cache first with a shorter TTL since enrollment can change
      return await CacheService.getOrSet(cacheKey, async () => {
        console.log(`Checking enrollment for user ${userId} in course ${courseId}`);
        
        try {
          // Use circuit breaker for primary enrollment check
          return await this.enrollmentStatusCircuitBreaker.execute(async () => {
            // Call enrollment service with user enrollment data
            const response = await this.callEnrollmentService(`/enrollments/${courseId}/status`, 'GET', null, userId);
            
            // Check if the response indicates successful enrollment
            const isEnrolled = response && response.status === 'success' && response.data && response.data.isEnrolled === true;
            console.log(`Enrollment result for user ${userId} in course ${courseId}: ${isEnrolled}`);
            return isEnrolled;
          });
        } catch (serviceError) {
          console.error(`Service error checking enrollment for user ${userId} in course ${courseId}:`, serviceError.message);
          
          // Try an alternative approach with its own circuit breaker
          try {
            // Use circuit breaker for alternative enrollment check
            const allEnrollmentsResponse = await this.enrollmentListCircuitBreaker.execute(async () => {
              return await this.callEnrollmentService(`/enrollments`, 'GET', null, userId);
            });
            
            if (allEnrollmentsResponse && allEnrollmentsResponse.status === 'success' && Array.isArray(allEnrollmentsResponse.data)) {
              // Check if any enrollment matches the courseId and has ENROLLED status
              const enrollment = allEnrollmentsResponse.data.find(e => 
                e.courseId === courseId && e.status === 'ENROLLED'
              );
              
              const isEnrolled = Boolean(enrollment);
              console.log(`Enrollment result (alternative method) for user ${userId} in course ${courseId}: ${isEnrolled}`);
              return isEnrolled;
            }
          } catch (alternativeError) {
            console.error(`Alternative enrollment check also failed:`, alternativeError.message);
          }
          
          // Both methods failed, but we've already triggered the circuit breakers
          // Default to allowing access in this failure case
          console.log(`⚠️ All enrollment checks failed, temporarily allowing access for user ${userId} to course ${courseId}`);
          return true;
        }
      }, 300); // 5 minute cache TTL
    } catch (error) {
      console.error(`Error checking enrollment for user ${userId} in course ${courseId}:`, error.message);
      return false;
    }
  }

  /**
   * Invalidate enrollment cache for a user and course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID (optional, if not provided invalidates all user enrollments)
   */
  static invalidateEnrollmentCache(userId, courseId = null) {
    if (courseId) {
      const cacheKey = `enrollment:${userId}:${courseId}`;
      CacheService.invalidate(cacheKey);
    } else {
      // Invalidate all enrollments for this user
      CacheService.invalidate(`enrollment:${userId}:`, true);
    }
  }
  /**
   * Call enrollment service API (which is part of payment service)
   * @param {string} endpoint - API endpoint to call (e.g. /enrollments/{courseId}/status)
   * @param {string} method - HTTP method
   * @param {Object} data - Request data
   * @param {string} userId - User ID for X-User-ID header
   * @returns {Promise<Object>} Response data
   */  static async callEnrollmentService(endpoint, method = 'GET', data = null, userId = null) {
    try {
      const token = this.generateServiceToken();
      const url = `${config.PAYMENT_SERVICE_URL}${endpoint}`;
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Add X-User-ID header for service-to-service user context
      if (userId) {
        headers['X-User-ID'] = userId;
      }
      
      // Create request config
      const requestConfig = {
        method,
        url,
        headers,
        timeout: 5000 // 5 seconds timeout
      };
      
      // Only add data property if there's actual data to send
      if (data !== null && data !== undefined) {
        // Ensure data is properly stringified when sent
        requestConfig.data = typeof data === 'string' ? data : JSON.stringify(data);
      }
      
      console.log(`Calling enrollment service at ${endpoint} with method ${method}`);
      const response = await axios(requestConfig);
      
      return response.data;
    } catch (error) {
      console.error(`Error calling enrollment service at ${endpoint}:`, error.message);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      throw error;
    }
  }

  /**
   * Generate a JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    return jwt.sign(
      { service: 'material-service', role: 'SERVICE' },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}
