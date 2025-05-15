import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export class CourseService {
  /**
   * Generate service-to-service JWT token
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    const payload = {
      service: 'material-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
  }
  
  /**
   * Check if a course exists by communicating with course-service
   * @param {string} courseId - Course ID to check
   * @returns {Promise<boolean>} Whether the course exists
   */
  static async checkCourseExists(courseId) {
    try {
      const courseServiceUrl = config.COURSE_SERVICE_URL;
      const token = this.generateServiceToken();
      
      const response = await axios.get(
        `${courseServiceUrl}/api/courses/${courseId}/exists`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 5000
        }
      );
      
      if (response.data && response.data.status === 'success') {
        return response.data.data.exists;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking course existence:', error.message);
      // In case of communication error, we can either:
      // 1. Assume the course doesn't exist (safer)
      // 2. Assume it exists and proceed (more permissive)
      // For now, let's be safe and assume it doesn't exist
      return false;
    }
  }
  
  /**
   * Get course details from course-service
   * @param {string} courseId - Course ID
   * @returns {Promise<Object|null>} Course details or null if not found
   */
  static async getCourseDetails(courseId) {
    try {
      const courseServiceUrl = config.COURSE_SERVICE_URL;
      const token = this.generateServiceToken();
      
      const response = await axios.get(
        `${courseServiceUrl}/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 5000
        }
      );
      
      if (response.data && response.data.status === 'success') {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching course details:', error.message);
      return null;
    }
  }
}