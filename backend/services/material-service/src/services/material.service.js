import { PrismaClient } from '@prisma/client';
import { CacheService } from './cache.service.js';
import { CourseService } from './course.service.js';
import { convertWibToUtc, formatDateObject } from '../utils/date-helper.js';
import config from '../config/index.js';

const prisma = new PrismaClient();

/**
 * Service for managing materials in OTI Academy
 */
export class MaterialService {
  /**
   * Create a new material
   * @param {Object} data - Material data
   * @returns {Promise<Object>} Created material
   */  static async createMaterial(data) {
    try {
      // Validate course exists using an integration service
      await CourseService.validateCourseExists(data.courseId);
      
      // Convert WIB date to UTC for storage
      const utcUnlockDate = convertWibToUtc(data.unlockDate);
      
      const material = await prisma.material.create({
        data: {
          courseId: data.courseId,
          title: data.title,
          description: data.description,
          resourceUrl: data.resourceUrl,
          unlockDate: utcUnlockDate
        }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${data.courseId}:materials`);
      
      return material;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  }
  /**
   * Format material data for response
   * @param {Object} material - Raw material data from database
   * @returns {Object} Formatted material data with proper date format
   */
  static formatMaterialResponse(material) {
    if (!material) return null;
    
    return {
      ...material,
      unlockDate: formatDateObject(material.unlockDate)
    };
  }
  /**
   * Get all materials for a course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} Materials for the course
   */  static async getMaterialsByCourse(courseId) {
    try {
      // Try to get from cache first
      const cacheKey = `course:${courseId}:materials`;
      const materials = await CacheService.getOrSet(cacheKey, async () => {
        const materials = await prisma.material.findMany({
          where: { courseId },
          orderBy: { unlockDate: 'asc' }
        });
        
        return materials;
      }, config.CACHE.TTL.COURSE_MATERIALS);
      
      // Format dates for response
      return materials.map(material => this.formatMaterialResponse(material));
    } catch (error) {
      console.error(`Error getting materials for course ${courseId}:`, error);
      throw error;
    }
  }  /**
   * Get material by ID
   * @param {string} id - Material ID
   * @returns {Promise<Object>} Material
   */  static async getMaterialById(id) {
    try {
    const cacheKey = `material:${id}`;
    const material = await CacheService.getOrSet(cacheKey, async () => {
      return prisma.material.findUnique({
        where: { id }
      });
    }, config.CACHE.TTL.MATERIAL);
      
      return this.formatMaterialResponse(material);
    } catch (error) {
      console.error(`Error getting material ${id}:`, error);
      throw error;
    }
  }  /**
   * Get all materials
   * @returns {Promise<Array>} All materials
   */  static async getAllMaterials() {
    try {
      // Try to get from cache first
      const cacheKey = 'all:materials';
      const materials = await CacheService.getOrSet(cacheKey, async () => {
        const materials = await prisma.material.findMany({
          orderBy: [
            { courseId: 'asc' },
            { unlockDate: 'asc' }
          ]
        });
        
        return materials;
      }, config.CACHE.TTL.ALL_MATERIALS);
      
      // Format dates for response
      return materials.map(material => this.formatMaterialResponse(material));
    } catch (error) {
      console.error('Error getting all materials:', error);
      throw error;
    }
  }

  /**
   * Update material
   * @param {string} id - Material ID
   * @param {Object} data - Updated material data
   * @returns {Promise<Object>} Updated material
   */
  static async updateMaterial(id, data) {
    try {
      // Get material before updating for cache invalidation
      const existingMaterial = await this.getMaterialById(id);
      if (!existingMaterial) {
        throw new Error(`Material with ID ${id} not found`);
      }
        const material = await prisma.material.update({
        where: { id },
        data: {
          title: data.title !== undefined ? data.title : undefined,
          description: data.description !== undefined ? data.description : undefined,
          resourceUrl: data.resourceUrl !== undefined ? data.resourceUrl : undefined,
          unlockDate: data.unlockDate !== undefined ? convertWibToUtc(data.unlockDate) : undefined
        }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${existingMaterial.courseId}:materials`);
      
      return material;
    } catch (error) {
      console.error(`Error updating material ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete material
   * @param {string} id - Material ID
   * @returns {Promise<Object>} Deleted material
   */
  static async deleteMaterial(id) {
    try {
      // Get material before deleting for cache invalidation
      const material = await this.getMaterialById(id);
      if (!material) {
        throw new Error(`Material with ID ${id} not found`);
      }
      
      const deletedMaterial = await prisma.material.delete({
        where: { id }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${material.courseId}:materials`);
      
      return deletedMaterial;
    } catch (error) {
      console.error(`Error deleting material ${id}:`, error);
      throw error;
    }
  }
}
