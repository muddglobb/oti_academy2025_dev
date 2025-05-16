import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CourseIntegrationService } from './course-integration.service.js';

export class CourseService {
  /**
   * Generate service-to-service JWT token
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    return jwt.sign(
      { service: 'material-service', role: 'SERVICE' },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  /**
   * Check if a course exists by communicating with course-service
   * @param {string} courseId - Course ID to check
   * @returns {Promise<boolean>} Whether the course exists
   */
  static async checkCourseExists(courseId) {
    try {
      // Use the CourseIntegrationService instead of duplicating code
      return await CourseIntegrationService.validateCourseExists(courseId);
    } catch (error) {
      console.error('Error checking course existence:', error.message);
      return false;
    }
  }

  /**
   * Validate that a course exists, throwing an error if it doesn't
   * @param {string} courseId - Course ID to validate
   * @throws {Error} If course doesn't exist
   */
  static async validateCourseExists(courseId) {
    try {
      const exists = await this.checkCourseExists(courseId);
      
      if (!exists) {
        console.error(`Course with ID ${courseId} does not exist or validation failed`);
        throw new Error(`Course with ID ${courseId} does not exist`);
      }
      
      return true;
    } catch (error) {
      if (error.message.includes('does not exist')) {
        throw error; // Re-throw the custom error
      } else {
        // Wrap other errors with more context
        throw new Error(`Failed to validate course existence: ${error.message}`);
      }
    }
  }
  
  /**
   * Get course details from course-service
   * @param {string} courseId - Course ID to get details for
   * @returns {Promise<Object>} Course details
   */
  static async getCourseDetails(courseId) {
    try {
      // Use the CourseIntegrationService instead of duplicating code
      return await CourseIntegrationService.getCourseDetails(courseId);
    } catch (error) {
      console.error('Error getting course details:', error.message);
      throw new Error(`Failed to get course details: ${error.message}`);
    }
  }
}