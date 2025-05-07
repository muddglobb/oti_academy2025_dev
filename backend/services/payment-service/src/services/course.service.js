import axios from 'axios';
import jwt from 'jsonwebtoken';

/**
 * CourseService - Handles integration with course-service
 */
export class CourseService {
  /**
   * Generate a valid JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    // Create a JWT token with service identity for inter-service communication
    const payload = {
      id: 'payment-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }

  /**
   * Get course by ID from course-service
   * @param {string} id - Course ID
   * @returns {Promise<Object>} Course with sessions
   */
  static async getCourseById(id) {
    try {
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = this.generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      const response = await axios.get(`${courseServiceUrl}/api/courses/${id}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching course:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return null;
    }
  }

  /**
   * Get courses by IDs from course-service
   * @param {string[]} ids - Array of course IDs
   * @returns {Promise<Object[]>} List of courses
   */
  static async getCoursesByIds(ids) {
    try {
      // Filter out any duplicates
      const uniqueIds = [...new Set(ids)];
      
      // Get all courses in parallel
      const coursesPromises = uniqueIds.map(id => this.getCourseById(id));
      const courses = await Promise.all(coursesPromises);
      
      // Filter out any null values (failed requests)
      return courses.filter(course => course !== null);
    } catch (error) {
      console.error('Error fetching courses by IDs:', error.message);
      return [];
    }
  }

  /**
   * Get all courses from course-service, optionally filtered by level
   * @param {string} level - Optional level filter (BEGINNER, INTERMEDIATE)
   * @returns {Promise<Object[]>} List of courses
   */
  static async getAllCourses(level = null) {
    try {
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = this.generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      // Add query parameters for filtering if level is provided
      const url = level 
        ? `${courseServiceUrl}/api/courses?level=${level}` 
        : `${courseServiceUrl}/api/courses`;
        
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all courses:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return [];
    }
  }
}