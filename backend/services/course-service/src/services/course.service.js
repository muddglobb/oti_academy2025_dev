import { CourseModel } from '../models/course.model.js';

export const CourseService = {
  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @returns {Promise<Object>} Created course
   */
  async createCourse(courseData) {
    return await CourseModel.create(courseData);
  },

  /**
   * Get course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object>} Course with sessions
   */
  async getCourseById(id) {
    const course = await CourseModel.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  },

  /**
   * Get all courses
   * @param {Object} filter - Filter options
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<Array>} List of courses
   */
  async getAllCourses(filter = {}, options = {}) {
    return await CourseModel.findAll(filter, options);
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
    return await CourseModel.update(id, data);
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
  }
};