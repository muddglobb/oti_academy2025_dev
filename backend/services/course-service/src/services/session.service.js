import { CourseModel } from '../models/course.model.js';
import { SessionModel } from '../models/session.model.js';

export const SessionService = {
  /**
   * Create a new session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(sessionData) {
    // Check if course exists
    const courseExists = await CourseModel.exists(sessionData.courseId);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    return await SessionModel.create(sessionData);
  },
  
  /**
   * Get session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Session
   */
  async getSessionById(id) {
    const session = await SessionModel.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  },
  
  /**
   * Get sessions by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} List of sessions
   */
  async getSessionsByCourse(courseId) {
    // Check if course exists
    const courseExists = await CourseModel.exists(courseId);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    return await SessionModel.findByCourseId(courseId);
  },
  
  /**
   * Update session
   * @param {string} id - Session ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated session
   */
  async updateSession(id, data) {
    const session = await SessionModel.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    
    return await SessionModel.update(id, data);
  },
  
  /**
   * Delete session
   * @param {string} id - Session ID
   * @returns {Promise<void>}
   */
  async deleteSession(id) {
    const session = await SessionModel.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    
    await SessionModel.delete(id);
  }
};