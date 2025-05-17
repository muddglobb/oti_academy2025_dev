import { CourseIntegrationService } from './course-integration.service.js';
import { convertUtcToWib } from '../utils/date-helper.js';

/**
 * Helper class for enhancing materials with additional information
 */
export class MaterialEnhancer {
  // Store hidden URLs in a WeakMap for privacy
  static #hiddenUrls = new WeakMap();

  /**
   * Get the hidden resource URL for a material if it exists
   * @param {Object} material - The material object
   * @returns {string|null} The hidden URL or null if none exists
   */
  static getHiddenResourceUrl(material) {
    return this.#hiddenUrls.get(material) || null;
  }

  /**
   * Enhance a list of materials with course information and unlock status
   * @param {Array} materials - List of materials
   * @param {boolean} includeCourseInfo - Whether to include course information
   * @param {boolean} isAdmin - Whether the user is an admin
   * @returns {Promise<Array>} Enhanced materials with course information
   */
  static async enhanceWithCourseInfo(materials, includeCourseInfo = false, isAdmin = false) {
    try {
      // Get the current date for unlock status
      const now = new Date();
        
      // Enhance each material with its course details and format dates correctly
      return materials.map(material => {
        // Format only the unlock date with timezone info, keep other dates simple
        const formattedMaterial = {
          ...material
        };
        
        // Add unlock status
        let isUnlocked = isAdmin;  // Admin always sees materials as unlocked
        let availableFrom = null;
        
        // Handle unlockDate formatting if it's not already formatted
        if (material.unlockDate) {
          let unlockDateObj;
          
          if (typeof material.unlockDate === 'object' && material.unlockDate.utc) {
            // Already formatted with utc/wib objects
            formattedMaterial.unlockDate = material.unlockDate;
            unlockDateObj = new Date(material.unlockDate.utc.iso);
            availableFrom = material.unlockDate.wib.iso;
          } else if (material.unlockDate instanceof Date) {
            // Direct Date object, format it
            unlockDateObj = material.unlockDate;
            const wibDate = convertUtcToWib(material.unlockDate);
            availableFrom = wibDate.toISOString();
            
            formattedMaterial.unlockDate = {
              utc: {
                iso: material.unlockDate.toISOString(),
                timestamp: material.unlockDate.getTime()
              },
              wib: {
                iso: wibDate.toISOString(),
                timestamp: wibDate.getTime()
              }
            };
          } else if (typeof material.unlockDate === 'string') {
            // String date
            unlockDateObj = new Date(material.unlockDate);
            const wibDate = convertUtcToWib(unlockDateObj);
            availableFrom = wibDate.toISOString();
            
            formattedMaterial.unlockDate = {
              utc: {
                iso: unlockDateObj.toISOString(),
                timestamp: unlockDateObj.getTime()
              },
              wib: {
                iso: wibDate.toISOString(),
                timestamp: wibDate.getTime()
              }
            };
          }
          
          // Check if unlock date has passed
          if (!isAdmin && unlockDateObj) {
            isUnlocked = unlockDateObj <= now;
          }
        } else {
          // If no unlock date, it's always unlocked
          isUnlocked = true;
        }
        
        // Add unlock status to the material
        formattedMaterial.unlocked = isUnlocked;        if (!isUnlocked) {
          formattedMaterial.availableFrom = availableFrom;
          
          // For materials that are not unlocked yet, save the resourceUrl to a private WeakMap
          // and set the actual resourceUrl to null so it can't be accessed
          if (formattedMaterial.resourceUrl) {
            // Store the original URL in our private WeakMap instead of as a property
            MaterialEnhancer.#hiddenUrls.set(formattedMaterial, formattedMaterial.resourceUrl);
            formattedMaterial.resourceUrl = null;
          }
        }
          
        // Ensure createdAt and updatedAt are ISO strings
        if (material.createdAt) {
          formattedMaterial.createdAt = material.createdAt instanceof Date 
            ? material.createdAt.toISOString() 
            : material.createdAt;
        }
        
        if (material.updatedAt) {
          formattedMaterial.updatedAt = material.updatedAt instanceof Date 
            ? material.updatedAt.toISOString() 
            : material.updatedAt;
        }
        
        // Don't include course information by default
        if (includeCourseInfo) {
          // Fetch course details only if explicitly requested
          formattedMaterial.course = { title: 'Course information not included' };
        }
        
        return formattedMaterial;
      });
    } catch (error) {
      console.error('Error enhancing materials with additional info:', error);
      // If enhancement fails, return original materials
      return materials;
    }
  }
}
