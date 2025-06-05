import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';

/**
 * Service for integrating with course service
 */
export class CourseIntegrationService {  /**
   * Validate that a course exists
   * @param {string} courseId - Course ID to validate
   * @returns {Promise<boolean>} True if course exists
   */    static async validateCourseExists(courseId) {
    try {
      // Try to get from cache first
      const cacheKey = `course:${courseId}:exists`;
      return await CacheService.getOrSet(cacheKey, async () => {
        // Make sure we're using the correct endpoint format
        const response = await this.callCourseService(`courses/${courseId}`);
        
        // Add more detailed logs to debug the response
        console.log(`Course validation response:`, {
          status: response.status,
          data: JSON.stringify(response.data)
        });
        
        // Check if we got a successful HTTP response (200) - that's enough to know the course exists
        // The course service is returning 200 when the course exists
        return response && response.status === 200;
      }, config.CACHE.TTL.COURSE_INFO);
    } catch (error) {
      console.error('Error validating course exists:', error.message);
      return false;
    }
  }

  /**
   * Call course service API
   * @param {string} endpoint - API endpoint to call
   * @param {string} method - HTTP method
   * @param {Object} data - Request data
   * @returns {Promise<Object>} Response data
   */    static async callCourseService(endpoint, method = 'GET', data = null) {
    try {
      const token = this.generateServiceToken();
      // Ensure correct URL formation with baseUrl and endpoint
      const baseUrl = config.COURSE_SERVICE_URL.endsWith('/') 
        ? config.COURSE_SERVICE_URL.slice(0, -1) 
        : config.COURSE_SERVICE_URL;
      
      // Fix endpoint to ensure it's correct format
      const formattedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      
      const url = `${baseUrl}${formattedEndpoint}`;
      
      console.log(`Making request to course service: ${url}`);
      
      // Do not send null data for GET requests
      const options = {
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Add timeout to prevent hanging requests
        timeout: 5000
      };
      
      // Only add data for non-GET requests
      if (method !== 'GET' && data !== null) {
        options.data = data;
      }
      
      const response = await axios(options);
      
      return response;
    } catch (error) {
      console.error(`Error calling course service at ${endpoint}:`, error.message);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      throw error;
    }
  }
  /**
   * Get course details by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Course details
   */    static async getCourseDetails(courseId) {
    try {
      const cacheKey = `course:${courseId}:details`;
      return await CacheService.getOrSet(cacheKey, async () => {
        const response = await this.callCourseService(`courses/${courseId}`);
        return response.data;
      }, config.CACHE.TTL.COURSE_INFO);
    } catch (error) {
      console.error('Error getting course details:', error.message);
      throw new Error(`Could not get details for course ${courseId}: ${error.message}`);
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