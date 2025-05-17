import { MaterialService } from '../services/material.service.js';
import { MaterialEnhancer } from '../services/material-enhancer.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import config from '../config/index.js';
import * as DateHelper from '../utils/date-helper.js';

/**
 * @desc    Create a new material
 * @route   POST /api/materials
 * @access  Admin
 */
export const createMaterial = asyncHandler(async (req, res) => {
  const { 
    courseId, 
    title, 
    description,
    resourceUrl,
    unlockDate
  } = req.body;

  // Validate input
  if (!courseId || !title || !resourceUrl || !unlockDate) {
    return res.status(400).json(
      ApiResponse.error('Course ID, title, resource URL, and unlock date are required')
    );
  }

  try {
    // Convert unlockDate from WIB to UTC for storage
    // NOTE: For storage, we want to maintain the actual time value in DB
    const utcUnlockDate = DateHelper.convertWibToUtc(unlockDate);
    
    if (!utcUnlockDate) {
      return res.status(400).json(
        ApiResponse.error('Invalid unlock date format')
      );
    }

    const material = await MaterialService.createMaterial({
      courseId,
      title,
      description,
      resourceUrl,
      unlockDate: utcUnlockDate
    });
    
    // For create response, use direct material data (no need to format)
    res.status(201).json(
      ApiResponse.success(material, 'Material created successfully')
    );
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error creating material')
    );
  }
});

/**
 * @desc    Get all materials
 * @route   GET /api/materials
 * @access  Admin
 */
export const getAllMaterials = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const isAdmin = userRole === 'ADMIN';
  
  try {
    const materials = await MaterialService.getAllMaterials();
    // Include course info for admin view, but add unlock status
    const enhancedMaterials = await MaterialEnhancer.enhanceWithCourseInfo(materials, true, isAdmin);

    res.status(200).json(
      ApiResponse.success(enhancedMaterials, 'All materials retrieved successfully')
    );
  } catch (error) {
    console.error('Error retrieving all materials:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error retrieving all materials')
    );
  }
});

/**
 * @desc    Get all materials for a course
 * @route   GET /api/materials/course/:courseId
 * @access  Authenticated
 */
export const getMaterialsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userRole = req.user.role;
  const isAdmin = userRole === 'ADMIN';
  
  try {
    const materials = await MaterialService.getMaterialsByCourse(courseId);
    
    // For non-admin users, filter materials by unlockDate
    let filteredMaterials = materials;
    if (!isAdmin) {
      const now = new Date();
      console.log('Current date for unlock filter:', now);
        // TEMPORARY: Bypass unlock date check
      const BYPASS_UNLOCK_DATE = true; // Set to true to temporarily bypass unlock date check - Show all materials but hide resourceUrl
      
      if (!BYPASS_UNLOCK_DATE) {
        filteredMaterials = materials.filter(material => {
          // Handle different material.unlockDate structures
          if (material.unlockDate && typeof material.unlockDate === 'object' && material.unlockDate.utc) {
            // New format with utc/wib objects
            return new Date(material.unlockDate.utc.iso) <= now;
          } else if (material.unlockDate instanceof Date) {
            // Direct Date object
            return material.unlockDate <= now;
          } else if (material.unlockDate) {
            // String or timestamp
            return new Date(material.unlockDate) <= now;
          }
          
          // If unlockDate is missing or invalid, show the material
          return true;
        });
          console.log(`Filtered ${materials.length} materials to ${filteredMaterials.length} available now`);
      } else {
        console.log(`Unlock date check bypassed - showing all ${materials.length} materials with resourceUrl hidden for future materials`);
      }
    }
    
    // Enhance materials with unlock status but WITHOUT course information
    const enhancedMaterials = await MaterialEnhancer.enhanceWithCourseInfo(filteredMaterials, false, isAdmin);

    res.status(200).json(
      ApiResponse.success(enhancedMaterials, 'Materials retrieved successfully')
    );
  } catch (error) {
    console.error(`Error retrieving materials:`, error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error retrieving materials')
    );
  }
});

/**
 * @desc    Get material by ID
 * @route   GET /api/materials/:id
 * @access  Authenticated
 */
export const getMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;

  try {
    const material = await MaterialService.getMaterialById(id);

    if (!material) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }    // Check if material is available based on unlockDate
    const isAdmin = userRole === 'ADMIN';
    if (!isAdmin) {
      // TEMPORARY: Bypass unlock date check
      const BYPASS_UNLOCK_DATE = false; // Set to false to enforce proper unlock date check
      
      if (!BYPASS_UNLOCK_DATE) {
        const now = new Date();
        
        let isUnlocked = true;
        let availableFrom = null;
        
        if (material.unlockDate && typeof material.unlockDate === 'object' && material.unlockDate.utc) {
          // New format with utc/wib objects
          isUnlocked = new Date(material.unlockDate.utc.iso) <= now;
          availableFrom = material.unlockDate.wib.iso;
        } else if (material.unlockDate instanceof Date) {
          // Direct Date object
          isUnlocked = material.unlockDate <= now;
          const wibDate = DateHelper.convertUtcToWib(material.unlockDate);
          availableFrom = wibDate.toISOString();
        } else if (material.unlockDate) {
          // String or timestamp
          isUnlocked = new Date(material.unlockDate) <= now;
          const unlockDate = new Date(material.unlockDate);
          const wibDate = DateHelper.convertUtcToWib(unlockDate);
          availableFrom = wibDate.toISOString();
        }
        
        if (!isUnlocked) {
          return res.status(403).json(
            ApiResponse.error(`This material will be available from ${availableFrom}`)
          );
        }
      }
    }
    
    // Enhance material with unlock status but WITHOUT course information
    const [enhancedMaterial] = await MaterialEnhancer.enhanceWithCourseInfo([material], false, isAdmin);

    // Date formatting is now handled inside the MaterialEnhancer service

    res.status(200).json(
      ApiResponse.success(enhancedMaterial, 'Material retrieved successfully')
    );
  } catch (error) {
    console.error('Error retrieving material:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error retrieving material')
    );
  }
});

/**
 * @desc    Update material
 * @route   PUT /api/materials/:id
 * @access  Admin
 */
export const updateMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    resourceUrl,
    unlockDate
  } = req.body;

  try {
    // Check if material exists
    const existingMaterial = await MaterialService.getMaterialById(id);
    if (!existingMaterial) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (resourceUrl) updatedData.resourceUrl = resourceUrl;
    
    // Convert unlockDate from WIB to UTC for storage
    if (unlockDate) {
      const utcUnlockDate = DateHelper.convertWibToUtc(unlockDate);
      
      if (!utcUnlockDate) {
        return res.status(400).json(
          ApiResponse.error('Invalid unlock date format')
        );
      }
      
      updatedData.unlockDate = utcUnlockDate;
    }

    const material = await MaterialService.updateMaterial(id, updatedData);

    // Return the material directly without date conversions
    res.status(200).json(
      ApiResponse.success(material, 'Material updated successfully')
    );
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error updating material')
    );
  }
});

/**
 * @desc    Delete material
 * @route   DELETE /api/materials/:id
 * @access  Admin
 */
export const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if material exists
    const material = await MaterialService.getMaterialById(id);
    if (!material) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }

    await MaterialService.deleteMaterial(id);

    res.status(200).json(
      ApiResponse.success(null, 'Material deleted successfully')
    );
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Error deleting material')
    );
  }
});
