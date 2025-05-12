import axios from 'axios';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';

// Create a cache instance for courses with 10 minute TTL
const courseCache = new NodeCache({ 
  stdTTL: 10 * 60, // 10 minutes
  checkperiod: 120 // Check for expired keys every 2 minutes
});

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
   */  static async getCourseById(id) {
    try {
      // Check cache first
      const cached = courseCache.get(`course:${id}`);
      if (cached) {
        return cached;
      }
      
      // Import circuit breaker utilities
      const { executeWithCircuitBreaker, retryWithBackoff } = await import('../utils/circuit-breaker.js');

      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = this.generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      // Use circuit breaker pattern for API call
      const courseData = await executeWithCircuitBreaker('course', async () => {
        const response = await retryWithBackoff(async () => {
          return await axios.get(`${courseServiceUrl}/courses/${id}`, { headers });
        }, 3, 1000);
        
        return response.data.data;
      });
      
      // Cache the result if it's valid
      if (courseData) {
        courseCache.set(`course:${id}`, courseData);
      }
      
      return courseData;
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
      
      if (uniqueIds.length === 0) {
        return [];
      }
      
      // Check if we can use a batch API first
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = this.generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      try {
        // Try to use batch API first
        const response = await axios.get(`${courseServiceUrl}/courses/batch`, { 
          headers,
          params: { ids: uniqueIds.join(',') }
        });
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      } catch (batchError) {
        // Batch API not available, fall back to individual requests
        console.warn('Batch API not available, falling back to individual requests:', batchError.message);
      }
      
      // Fall back to individual requests if batch failed
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
   * Preload multiple courses into cache
   * @param {string[]} courseIds - Array of course IDs to preload
   * @returns {Promise<void>}
   */
  static async preloadCoursesIntoCache(courseIds) {
    if (!courseIds || courseIds.length === 0) return;
    
    // Filter to only IDs not already in cache
    const uniqueIds = [...new Set(courseIds)];
    const uncachedIds = uniqueIds.filter(id => !courseCache.has(`course:${id}`));
    
    if (uncachedIds.length === 0) return;
    
    try {
      // Try batch API first
      const courses = await this.getCoursesByIds(uncachedIds);
      
      // Cache each course
      courses.forEach(course => {
        if (course && course.id) {
          courseCache.set(`course:${course.id}`, course);
        }
      });
      
      console.log(`Preloaded ${courses.length} courses into cache`);
    } catch (error) {
      console.error('Error preloading courses into cache:', error.message);
    }
  }

  /**
   * Clear course cache for specific ID or all courses
   * @param {string} [courseId] - Optional course ID to clear from cache
   */
  static clearCourseCache(courseId = null) {
    if (courseId) {
      courseCache.del(`course:${courseId}`);
    } else {
      courseCache.flushAll();
    }
  }

  /**
   * Get all courses from course-service, optionally filtered by level
   * @param {string} level - Optional level filter (ENTRY, INTERMEDIATE)
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
        ? `${courseServiceUrl}/courses?level=${level}` 
        : `${courseServiceUrl}/courses`;
        
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
  
  /**
   * Get course enrollment count from enrollment service
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Enrollment counts
   */
  static async getEnrollmentCount(courseId) {
    try {
      // In the future, call to a real enrollment service
      // For now, return default values
      return {
        total: 0,
        bundleCount: 0,
        entryIntermediateCount: 0
      };
    } catch (error) {
      console.error('Error fetching enrollment count:', error.message);
      return {
        total: 0,
        bundleCount: 0,
        entryIntermediateCount: 0
      };
    }
  }
}