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
    try {
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
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
    const courseMap = {};
    
    // Fetch courses in parallel
    await Promise.all(
      uniqueIds.map(async (id) => {
        const course = await this.getCourseById(id);
        if (course) {
          courseMap[id] = course;
        }
      })
    );
    
    return courseMap;
  }
};