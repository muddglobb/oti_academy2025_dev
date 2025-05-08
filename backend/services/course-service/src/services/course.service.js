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
  }
};