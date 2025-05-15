import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';

/**
 * Service for integrating with course service
 */
export class CourseIntegrationService {
  /**
   * Validate that a course exists
   * @param {string} courseId - Course ID to validate
   * @returns {Promise<boolean>} True if course exists
   */
  static async validateCourseExists(courseId) {
    try {
      // Try to get from cache first
      const cacheKey = `course:${courseId}:exists`;
      return await CacheService.getOrSet(cacheKey, async () => {
        const response = await this.callCourseService(`/courses/${courseId}`);
        return response && response.status === 'success' && response.data;
      });
    } catch (error) {
      console.error('Error validating course exists:', error.message);
      return false;
    }
  }

  /**
   * Get course details by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Course details
   */
  static async getCourseDetails(courseId) {
    try {
      const cacheKey = `course:${courseId}:details`;
      return await CacheService.getOrSet(cacheKey, async () => {
        const response = await this.callCourseService(`/courses/${courseId}`);
        return response.data;
      });
    } catch (error) {
      console.error('Error getting course details:', error.message);
      throw new Error(`Could not get details for course ${courseId}: ${error.message}`);
    }
  }

  /**
   * Call course service API
   * @param {string} endpoint - API endpoint to call
   * @param {string} method - HTTP method
   * @param {Object} data - Request data
   * @returns {Promise<Object>} Response data
   */
  static async callCourseService(endpoint, method = 'GET', data = null) {
    try {
      const token = this.generateServiceToken();
      const url = `${config.COURSE_SERVICE_URL}${endpoint}`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error calling course service at ${endpoint}:`, error.message);
      
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