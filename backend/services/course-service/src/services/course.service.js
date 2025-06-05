import { CourseModel } from '../models/course.model.js';
import { CacheService } from './cache.service.js';

export const CourseService = {
  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @returns {Promise<Object>} Created course
   */
  async createCourse(courseData) {
    const course = await CourseModel.create(courseData);
    
    // Invalidate courses cache after creating a new course
    await CacheService.invalidate('courses:*', true);
    
    return course;
  },

  /**
   * Get course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object>} Course with sessions
   */
  async getCourseById(id) {
    return await CacheService.getOrSet(`course:${id}`, async () => {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    }, 30 * 60); // Cache for 30 minutes
  },

  /**
   * Get all courses
   * @param {Object} filter - Filter options
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<Array>} List of courses
   */
  async getAllCourses(filter = {}, options = {}) {
    // Generate cache key based on filter and options
    const cacheKey = `courses:${JSON.stringify(filter)}:${JSON.stringify(options)}`;
    
    return await CacheService.getOrSet(cacheKey, async () => {
      return await CourseModel.findAll(filter, options);
    }, 30 * 60); // Cache for 30 minutes
  },

  /**
   * Update course
   * @param {string} id - Course ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated course
   */
  async updateCourse(id, data) {
    const courseExists = await CourseModel.exists(id);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    const updatedCourse = await CourseModel.update(id, data);
    
    // Invalidate specific course cache and any cached lists
    await Promise.all([
      CacheService.invalidate(`course:${id}`),
      CacheService.invalidate('courses:*', true)
    ]);
    
    return updatedCourse;
  },

  /**
   * Delete course
   * @param {string} id - Course ID
   * @returns {Promise<void>}
   */
  async deleteCourse(id) {
    const courseExists = await CourseModel.exists(id);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    await CourseModel.delete(id);
    
    // Invalidate specific course cache and any cached lists
    await Promise.all([
      CacheService.invalidate(`course:${id}`),
      CacheService.invalidate('courses:*', true)
    ]);
  },
  /**
   * Get multiple courses by IDs (for batch operations)
   * @param {Array<string>} ids - Array of course IDs
   * @returns {Promise<Array>} List of courses
   */
  async getCoursesByIds(ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return [];
    }
    
    // Remove duplicates and limit to reasonable batch size
    const uniqueIds = [...new Set(ids)].slice(0, 50);
    
    try {
      console.log(`🔍 Batch request for ${uniqueIds.length} courses:`, uniqueIds);
      
      // Try to get from cache first with error handling
      const cachedCourses = [];
      const missingIds = [];
      
      for (const id of uniqueIds) {
        try {
          const cached = await CacheService.getorSet(`course:${id}`);
          if (cached) {
            cachedCourses.push(cached);
          } else {
            missingIds.push(id);
          }
        } catch (cacheError) {
          console.warn(`Cache error for course ${id}:`, cacheError.message);
          missingIds.push(id);
        }
      }
      
      // Fetch missing courses from database
      let dbCourses = [];
      if (missingIds.length > 0) {
        console.log(`📚 Fetching ${missingIds.length} courses from database`);
        dbCourses = await CourseModel.findByIds(missingIds);
        
        // Cache the newly fetched courses with error handling
        for (const course of dbCourses) {
          try {
            await CacheService.set(`course:${course.id}`, course, 30 * 60);
          } catch (cacheError) {
            console.warn(`Failed to cache course ${course.id}:`, cacheError.message);
          }
        }
      }
      
      // Combine cached and database results
      const allCourses = [...cachedCourses, ...dbCourses];
      
      console.log(`✅ Successfully retrieved ${allCourses.length} courses for batch request`);
      
      // Return courses in the same order as requested IDs
      return uniqueIds.map(id => 
        allCourses.find(course => course.id === id)
      ).filter(Boolean);
      
    } catch (error) {
      console.error('Error in getCoursesByIds:', error);
      
      // Fallback: try to get directly from database without cache
      try {
        console.log('🔄 Fallback: fetching directly from database');
        const courses = await CourseModel.findByIds(uniqueIds);
        console.log(`✅ Fallback successful: retrieved ${courses.length} courses`);
        return courses;
      } catch (dbError) {
        console.error('Database fallback also failed:', dbError);
        throw new Error(`Failed to fetch courses: ${dbError.message}`);
      }
    }
  },
};