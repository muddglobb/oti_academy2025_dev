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
 * @param {boolean} isAdmin - Whether the user is admin
 * @returns {Object} Formatted material data with proper date format
 */
static formatMaterialResponse(material, isAdmin = false) {
  if (!material) return null;
  
  // Check if material is unlocked based on current time
  const now = new Date();
  const unlockDate = new Date(material.unlockDate);
  const isUnlocked = now >= unlockDate;
  
  const formatted = {
    ...material,
    unlockDate: formatDateObject(material.unlockDate),
    unlocked: isUnlocked, // Add unlocked status based on date
    // Add admin-specific info if user is admin
    ...(isAdmin && {
      adminInfo: {
        unlocked: isUnlocked,
        unlockStatus: isUnlocked ? 'UNLOCKED' : 'LOCKED',
        timeUntilUnlock: isUnlocked ? null : unlockDate.getTime() - now.getTime(),
        daysUntilUnlock: isUnlocked ? null : Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }
    })
  };
  
  return formatted;
}
  
  /**
   * Get all materials for a course
   * @param {string} courseId - Course ID
   * @param {boolean} isAdmin - Whether the user is admin
   * @returns {Promise<Array>} Materials for the course
   */    
  static async getMaterialsByCourse(courseId, isAdmin = false) {
    try {
      const ttl = config.CACHE?.TTL?.COURSE_MATERIALS || 900;
      const cacheKey = `course:${courseId}:materials`;
      
      const materials = await CacheService.getOrSet(cacheKey, async () => {
        const materials = await prisma.material.findMany({
          where: { courseId },
          orderBy: { unlockDate: 'asc' }
        });
        
        return materials;
      }, ttl);
      
      // Format dates for response with admin info
      const formattedMaterials = materials.map(material => this.formatMaterialResponse(material, isAdmin));
      
      return formattedMaterials;
    } catch (error) {
      console.error(`Error getting materials for course ${courseId}:`, error);
      throw error;
    }
  }/**
   * Get material by ID
   * @param {string} id - Material ID
   * @param {boolean} isAdmin - Whether the user is admin
   * @returns {Promise<Object>} Material
   */  
  static async getMaterialById(id, isAdmin = false) {
    try {
    const cacheKey = `material:${id}`;
    const material = await CacheService.getOrSet(cacheKey, async () => {
      return prisma.material.findUnique({
        where: { id }
      });
    }, config.CACHE.TTL.MATERIAL);
      
      return this.formatMaterialResponse(material, isAdmin);
    } catch (error) {
      console.error(`Error getting material ${id}:`, error);
      throw error;
    }
  }  /**
   * Get all materials
   * @param {boolean} isAdmin - Whether the user is admin
   * @returns {Promise<Array>} All materials
   */  
  static async getAllMaterials(isAdmin = false) {
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
      
      // Format dates for response with admin info
      return materials.map(material => this.formatMaterialResponse(material, isAdmin));
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
