import { PrismaClient } from '@prisma/client';
import { SectionService } from './section.service.js';
import { CacheService } from './cache.service.js';

const prisma = new PrismaClient();

/**
 * Service for managing materials in OTI Academy
 */
export class MaterialService {
  /**
   * Create a new material
   * @param {Object} data - Material data
   * @returns {Promise<Object>} Created material
   */
  static async createMaterial(data) {
    try {
      // Validate if section exists
      const section = await SectionService.getSectionById(data.sectionId);
      if (!section) {
        throw new Error(`Section with ID ${data.sectionId} not found`);
      }
      
      // Check if order is provided, otherwise get max order + 1
      if (!data.order) {
        const maxOrder = await this.getMaxMaterialOrder(data.sectionId);
        data.order = maxOrder + 1;
      }

      const material = await prisma.material.create({
        data: {
          sectionId: data.sectionId,
          title: data.title,
          description: data.description,
          type: data.type,
          content: data.content,
          fileUrl: data.fileUrl,
          externalUrl: data.externalUrl,
          order: data.order,
          duration: data.duration,
          status: data.status || 'ACTIVE'
        }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${section.courseId}:sections`);
      await CacheService.invalidate(`section:${data.sectionId}:materials`);
      
      return material;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  }

  /**
   * Get all materials for a section
   * @param {string} sectionId - Section ID
   * @returns {Promise<Array>} Materials in the section
   */
  static async getMaterialsBySection(sectionId) {
    try {
      // Try to get from cache first
      const cacheKey = `section:${sectionId}:materials`;
      return await CacheService.getOrSet(cacheKey, async () => {
        const materials = await prisma.material.findMany({
          where: { sectionId },
          orderBy: { order: 'asc' }
        });
        
        return materials;
      });
    } catch (error) {
      console.error(`Error getting materials for section ${sectionId}:`, error);
      throw error;
    }
  }

  /**
   * Get material by ID
   * @param {string} id - Material ID
   * @returns {Promise<Object>} Material
   */
  static async getMaterialById(id) {
    try {
      const material = await prisma.material.findUnique({
        where: { id }
      });
      
      return material;
    } catch (error) {
      console.error(`Error getting material ${id}:`, error);
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
      
      // Get section to invalidate course cache
      const section = await SectionService.getSectionById(existingMaterial.sectionId);
      
      const material = await prisma.material.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          content: data.content,
          fileUrl: data.fileUrl,
          externalUrl: data.externalUrl,
          order: data.order,
          duration: data.duration,
          status: data.status
        }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${section.courseId}:sections`);
      await CacheService.invalidate(`section:${existingMaterial.sectionId}:materials`);
      
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
      
      // Get section to invalidate course cache
      const section = await SectionService.getSectionById(material.sectionId);
      
      const deletedMaterial = await prisma.material.delete({
        where: { id }
      });

      // Invalidate cache
      await CacheService.invalidate(`course:${section.courseId}:sections`);
      await CacheService.invalidate(`section:${material.sectionId}:materials`);
      
      return deletedMaterial;
    } catch (error) {
      console.error(`Error deleting material ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get the highest order number for materials in a section
   * @param {string} sectionId - Section ID
   * @returns {Promise<number>} Max order value or 0
   */
  static async getMaxMaterialOrder(sectionId) {
    const result = await prisma.material.aggregate({
      where: { sectionId },
      _max: { order: true }
    });
    
    return result._max.order || 0;
  }
}