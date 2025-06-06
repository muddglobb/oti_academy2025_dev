import { CourseModel } from '../models/course.model.js';
import { SessionModel } from '../models/session.model.js';
import { CacheService } from './cache.service.js';
import { SessionNotFoundError, CourseNotFoundError } from '../utils/errors.js';

export const SessionService = {  /**
   * Create a new session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(sessionData) {
    // Check if course exists
    const courseExists = await CourseModel.exists(sessionData.courseId);
    if (!courseExists) {
      throw new CourseNotFoundError();
    }
    
    const session = await SessionModel.create(sessionData);
    
    // Invalidate related caches
    await Promise.all([
      CacheService.invalidate(`course:${sessionData.courseId}`),
      CacheService.invalidate(`course-sessions:${sessionData.courseId}`)
    ]);
    
    return session;
  },
    /**
   * Get session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Session
   */
  async getSessionById(id) {
    return await CacheService.getOrSet(`session:${id}`, async () => {
      const session = await SessionModel.findById(id);
      if (!session) {
        throw new SessionNotFoundError();
      }
      return session;
    }, 30 * 60); // Cache for 30 minutes
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
      throw new CourseNotFoundError();
    }
    
    return await CacheService.getOrSet(`course-sessions:${courseId}`, async () => {
      return await SessionModel.findByCourseId(courseId);
    }, 30 * 60); // Cache for 30 minutes
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
      throw new SessionNotFoundError();
    }
    
    const updatedSession = await SessionModel.update(id, data);
    
    // Invalidate related caches
    await Promise.all([
      CacheService.invalidate(`session:${id}`),
      CacheService.invalidate(`course-sessions:${session.courseId}`),
      CacheService.invalidate(`course:${session.courseId}`)
    ]);
    
    return updatedSession;
  },
    /**
   * Delete session
   * @param {string} id - Session ID
   * @returns {Promise<void>}
   */
  async deleteSession(id) {
    const session = await SessionModel.findById(id);
    if (!session) {
      throw new SessionNotFoundError();
    }
    
    await SessionModel.delete(id);
    
    // Invalidate related caches
    await Promise.all([
      CacheService.invalidate(`session:${id}`),
      CacheService.invalidate(`course-sessions:${session.courseId}`),
      CacheService.invalidate(`course:${session.courseId}`)
    ]);
  }
};