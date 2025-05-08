import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SessionModel = {
  /**
   * Create a new session
   * @param {Object} data - Session data
   * @returns {Promise<Object>} Created session
   */
  async create(data) {
    return await prisma.session.create({
      data
    });
  },

  /**
   * Find session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Session
   */
  async findById(id) {
    return await prisma.session.findUnique({
      where: { id }
    });
  },

  /**
   * Find sessions by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} List of sessions
   */
  async findByCourseId(courseId) {
    return await prisma.session.findMany({
      where: { courseId },
      orderBy: { startAt: 'asc' }
    });
  },

  /**
   * Update session
   * @param {string} id - Session ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated session
   */
  async update(id, data) {
    return await prisma.session.update({
      where: { id },
      data
    });
  },

  /**
   * Delete session
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Deleted session
   */
  async delete(id) {
    return await prisma.session.delete({
      where: { id }
    });
  }
};