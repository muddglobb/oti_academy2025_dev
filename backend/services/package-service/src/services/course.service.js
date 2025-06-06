import axios from 'axios';
import jwt from 'jsonwebtoken';

// Generate service JWT token for inter-service communication
function generateServiceToken() {
  const payload = {
    id: 'package-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
}

export const CourseService = {
  /**
   * Fetch course data by ID from course service
   * @param {string} courseId - Course ID to fetch
   * @returns {Promise<Object|null>} Course data or null if not found
   */
  async getCourseById(courseId) {
    try {      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`,
        'x-service-token': process.env.SERVICE_API_KEY,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.get(`${courseServiceUrl}/courses/${courseId}`, { headers });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch course ${courseId}:`, error.message);
      return null;
    }
  },
    /**
   * Fetch multiple courses by their IDs
   * @param {Array<string>} courseIds - Array of course IDs to fetch
   * @returns {Promise<Object>} Map of course IDs to course data
   */
  async getCoursesByIds(courseIds) {
    const uniqueIds = [...new Set(courseIds)]; // Remove duplicates
    
    try {
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`,
        'x-service-token': process.env.SERVICE_API_KEY,
        'Content-Type': 'application/json'
      };
      
      // Try batch endpoint first
      try {
        const response = await axios.post(`${courseServiceUrl}/courses/batch`, {
          courseIds: uniqueIds
        }, { headers });
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Convert array to map
          const courseMap = {};
          response.data.data.forEach(course => {
            if (course && course.id) {
              courseMap[course.id] = course;
            }
          });
          return courseMap;
        }
      } catch (batchError) {
        console.warn('Batch API not available, falling back to individual requests:', batchError.message);
      }
      
      // Fallback to individual requests
      const courseMap = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          const course = await this.getCourseById(id);
          if (course) {
            courseMap[id] = course;
          }
        })
      );
      
      return courseMap;
    } catch (error) {
      console.error('Error fetching courses by IDs:', error.message);
      return {};
    }
  }
};