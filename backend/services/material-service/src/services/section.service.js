import { SectionModel } from '../models/section.model.js';
import { CourseService } from './course.service.js';

export class SectionService {
  /**
   * Create a new section
   * @param {Object} data - Section data
   * @returns {Promise<Object>} Created section
   */
  static async createSection(data) {
    // Validate course exists (optional, could be delegated to course-service)
    const courseExists = await CourseService.checkCourseExists(data.courseId);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    // Set order if not provided
    if (data.order === undefined) {
      data.order = await SectionModel.getNextOrder(data.courseId);
    }
    
    return await SectionModel.create(data);
  }

  /**
   * Get section by ID
   * @param {string} id - Section ID
   * @returns {Promise<Object>} Section
   */
  static async getSectionById(id) {
    return await SectionModel.findById(id);
  }

  /**
   * Get all sections for a course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} List of sections
   */
  static async getSectionsByCourse(courseId) {
    // Validate course exists (optional)
    const courseExists = await CourseService.checkCourseExists(courseId);
    if (!courseExists) {
      throw new Error('Course not found');
    }
    
    return await SectionModel.findByCourse(courseId);
  }

  /**
   * Update a section
   * @param {string} id - Section ID
   * @param {Object} data - Updated section data
   * @returns {Promise<Object>} Updated section
   */
  static async updateSection(id, data) {
    // Check if section exists
    const section = await SectionModel.findById(id);
    if (!section) {
      throw new Error('Section not found');
    }
    
    return await SectionModel.update(id, data);
  }

  /**
   * Delete a section
   * @param {string} id - Section ID
   * @returns {Promise<Object>} Deleted section
   */
  static async deleteSection(id) {
    // Check if section exists
    const section = await SectionModel.findById(id);
    if (!section) {
      throw new Error('Section not found');
    }
    
    // Note: All materials in this section will be deleted due to cascade delete in schema
    return await SectionModel.delete(id);
  }

  /**
   * Reorder sections for a course
   * @param {string} courseId - Course ID
   * @param {Array} orderedIds - Array of section IDs in desired order
   * @returns {Promise<Array>} Updated sections
   */
  static async reorderSections(courseId, orderedIds) {
    const sections = await SectionModel.findByCourse(courseId);
    
    // Validate all IDs belong to this course
    const sectionIds = new Set(sections.map(s => s.id));
    const allIdsValid = orderedIds.every(id => sectionIds.has(id));
    
    if (!allIdsValid) {
      throw new Error('Invalid section IDs provided');
    }
    
    // Update order for each section
    const updates = orderedIds.map((id, index) => 
      SectionModel.update(id, { order: index + 1 })
    );
    
    await Promise.all(updates);
    
    // Return updated sections
    return await SectionModel.findByCourse(courseId);
  }
}import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';

const prisma = new PrismaClient();

/**
 * Service for managing sections in OTI Academy
 */
export class SectionService {
  /**
   * Create a new section
   * @param {Object} data - Section data
   * @returns {Promise<Object>} Created section
   */
  static async createSection(data) {
    try {
      // Validate if course exists
      await this.validateCourseExists(data.courseId);
      
      // Check if order is provided, otherwise get max order + 1
      if (!data.order) {
        const maxOrder = await this.getMaxSectionOrder(data.courseId);
        data.order = maxOrder + 1;
      }

      const section = await prisma.section.create({
        data: {
          courseId: data.courseId,
          title: data.title,
          description: data.description,
          order: data.order
        }
      });

      // Invalidate cache after creating
      await CacheService.invalidate(`course:${data.courseId}:sections`);
      
      return section;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  }

  /**
   * Get all sections for a course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} All sections for the course
   */
  static async getSectionsByCourse(courseId) {
    try {
      // Try to get from cache first
      const cacheKey = `course:${courseId}:sections`;
      return await CacheService.getOrSet(cacheKey, async () => {
        // Validate if course exists
        await this.validateCourseExists(courseId);
        
        const sections = await prisma.section.findMany({
          where: { courseId },
          orderBy: { order: 'asc' },
          include: {
            materials: {
              orderBy: { order: 'asc' }
            }
          }
        });
        
        return sections;
      });
    } catch (error) {
      console.error(`Error getting sections for course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Get section by ID
   * @param {string} id - Section ID
   * @returns {Promise<Object>} Section with materials
   */
  static async getSectionById(id) {
    try {
      const section = await prisma.section.findUnique({
        where: { id },
        include: {
          materials: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      return section;
    } catch (error) {
      console.error(`Error getting section ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update section
   * @param {string} id - Section ID
   * @param {Object} data - Updated section data
   * @returns {Promise<Object>} Updated section
   */
  static async updateSection(id, data) {
    try {
      const section = await prisma.section.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          order: data.order
        }
      });

      // Invalidate cache after updating
      const existingSection = await this.getSectionById(id);
      await CacheService.invalidate(`course:${existingSection.courseId}:sections`);
      
      return section;
    } catch (error) {
      console.error(`Error updating section ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete section
   * @param {string} id - Section ID
   * @returns {Promise<Object>} Deleted section
   */
  static async deleteSection(id) {
    try {
      // Get section before deleting for cache invalidation
      const section = await this.getSectionById(id);
      
      const deletedSection = await prisma.section.delete({
        where: { id }
      });

      // Invalidate cache after deleting
      await CacheService.invalidate(`course:${section.courseId}:sections`);
      
      return deletedSection;
    } catch (error) {
      console.error(`Error deleting section ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate if a course exists
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} True if course exists
   * @throws {Error} If course doesn't exist
   */
  static async validateCourseExists(courseId) {
    try {
      // Generate service token for service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Call course service to check if course exists
      const response = await axios.get(
        `${config.COURSE_SERVICE_URL}/courses/${courseId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${serviceToken}` 
          }
        }
      );
      
      return response.data && response.data.status === 'success';
    } catch (error) {
      console.error(`Error validating course ${courseId}:`, error.message);
      if (error.response && error.response.status === 404) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      throw error;
    }
  }

  /**
   * Generate JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    const jwt = require('jsonwebtoken');
    
    return jwt.sign(
      { 
        service: 'material-service', 
        role: 'SERVICE' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  /**
   * Get the highest order number for sections in a course
   * @param {string} courseId - Course ID
   * @returns {Promise<number>} Max order value or 0
   */
  static async getMaxSectionOrder(courseId) {
    const result = await prisma.section.aggregate({
      where: { courseId },
      _max: { order: true }
    });
    
    return result._max.order || 0;
  }
}