import { MaterialService } from '../services/material.service.js';
import { MaterialEnhancer } from '../services/material-enhancer.service.js';
import { CacheService } from '../services/cache.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import config from '../config/index.js';
import * as DateHelper from '../utils/date-helper.js';
import jwt from 'jsonwebtoken';

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
    }    const material = await MaterialService.createMaterial({
      courseId,
      title,
      description,
      resourceUrl,
      unlockDate: utcUnlockDate
    });
    
    // Invalidate related caches
    await CacheService.invalidate(`materials:course:${courseId}`);
    await CacheService.invalidate('materials:all');
    
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
    const materials = await MaterialService.getAllMaterials(isAdmin);
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
    const materials = await MaterialService.getMaterialsByCourse(courseId, isAdmin);
    
    if (materials.length === 0) {
      return res.status(404).json(
        ApiResponse.error('No materials found for this course')
      );
    }
    
    // Use MaterialEnhancer to properly handle unlock dates and resource URLs
    const enhancedMaterials = await MaterialEnhancer.enhanceWithCourseInfo(materials, false, isAdmin);
    
    // Transform materials based on user role and unlock dates
    const transformedMaterials = enhancedMaterials.map(material => {
      const baseMaterial = {
        id: material.id,
        courseId: material.courseId,
        title: material.title,
        description: material.description,
        unlockDate: material.unlockDate,
        createdAt: material.createdAt,
        updatedAt: material.updatedAt
      };

      // Determine if material is unlocked (admin always sees as unlocked)
      const isUnlocked = isAdmin || material.unlocked;
      
      // For authenticated enrolled users
      if (isAdmin) {
        baseMaterial.resourceUrl = material.resourceUrl || MaterialEnhancer.getHiddenResourceUrl(material);
        baseMaterial.enrollmentStatus = 'admin_access';
        // TAMBAH: Admin info dan unlock status
        if (material.adminInfo) {
          baseMaterial.adminInfo = material.adminInfo;
        }
        baseMaterial.unlocked = material.unlocked;
      } else {
        // For enrolled users, show resourceUrl only if material is unlocked
        if (isUnlocked) {
          baseMaterial.resourceUrl = material.resourceUrl || MaterialEnhancer.getHiddenResourceUrl(material);
        } else {
          baseMaterial.resourceUrl = null;
          baseMaterial.message = `This material will be available from ${material.availableFrom || 'soon'}`;
        }
        baseMaterial.enrollmentStatus = 'enrolled';
        baseMaterial.unlocked = material.unlocked;
      }

      return baseMaterial;
    });

    res.status(200).json(
      ApiResponse.success(transformedMaterials, 'Materials retrieved successfully')
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
    const material = await MaterialService.getMaterialById(id, userRole === 'ADMIN');

    if (!material) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }    // Check if material is available based on unlockDate
    const isAdmin = userRole === 'ADMIN';
    if (!isAdmin) {
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
    const existingMaterial = await MaterialService.getMaterialById(id, false);
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
    }    const material = await MaterialService.updateMaterial(id, updatedData);

    // Invalidate related caches
    await CacheService.invalidate(`materials:${id}`);
    await CacheService.invalidate(`materials:course:${existingMaterial.courseId}`);
    await CacheService.invalidate('materials:all');

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
    const material = await MaterialService.getMaterialById(id, false);
    if (!material) {
      return res.status(404).json(
        ApiResponse.error('Material not found')
      );
    }    await MaterialService.deleteMaterial(id);

    // Invalidate related caches
    await CacheService.invalidate(`materials:${id}`);
    await CacheService.invalidate(`materials:course:${material.courseId}`);
    await CacheService.invalidate('materials:all');

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

/**
 * @desc    Get all materials for a course (Public access - no enrollment required)
 * @route   GET /api/materials/course/:courseId/public
 * @access  Public
 */
export const getMaterialsByCoursePublic = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  try {
    let isAdmin = false;
    let isUserEnrolled = false;
    let userId = null;
    
    // Extract token if provided (optional authentication)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
        userId = decoded.id;
        
        // Check if user is admin
        isAdmin = decoded.role === 'ADMIN';
        
        // Check enrollment status (only if not admin)
        if (!isAdmin) {
          const { EnrollmentIntegrationService } = await import('../services/enrollment-integration.service.js');
          isUserEnrolled = await EnrollmentIntegrationService.isUserEnrolled(userId, courseId);
        }
      } catch (tokenError) {
        // Token invalid or enrollment check failed, continue as non-enrolled user
        console.log('Optional authentication failed, continuing as guest:', tokenError.message);
      }
    }

    // Get all materials for the course
    const materials = await MaterialService.getMaterialsByCourse(courseId, isAdmin);
    
    if (materials.length === 0) {
      return res.status(404).json(
        ApiResponse.error('No materials found for this course')
      );
    }

    // Use MaterialEnhancer to properly handle unlock dates and resource URLs
    const enhancedMaterials = await MaterialEnhancer.enhanceWithCourseInfo(materials, false, isAdmin);
    
    // Transform materials based on enrollment status and unlock dates
    const transformedMaterials = enhancedMaterials.map(material => {
      const baseMaterial = {
        id: material.id,
        courseId: material.courseId,
        title: material.title,
        description: material.description,
        unlockDate: material.unlockDate,
        createdAt: material.createdAt,
        updatedAt: material.updatedAt
      };

      // Determine if material is unlocked (admin always sees as unlocked)
      const isUnlocked = isAdmin || material.unlocked;
      
      // Include resourceUrl only if user is admin OR (enrolled AND material is unlocked)
      if (isAdmin) {
        baseMaterial.resourceUrl = material.resourceUrl || MaterialEnhancer.getHiddenResourceUrl(material);
        baseMaterial.enrollmentStatus = 'admin_access';
        // TAMBAH: Admin info untuk debugging
        if (material.adminInfo) {
          baseMaterial.adminInfo = material.adminInfo;
        }
        baseMaterial.unlocked = material.unlocked;
      } else if (isUserEnrolled) {
        // For enrolled users, show resourceUrl only if material is unlocked
        if (isUnlocked) {
          baseMaterial.resourceUrl = material.resourceUrl || MaterialEnhancer.getHiddenResourceUrl(material);
        } else {
          baseMaterial.resourceUrl = null;
          baseMaterial.message = `This material will be available from ${material.availableFrom || 'soon'}`;
        }
        baseMaterial.enrollmentStatus = 'enrolled';
        baseMaterial.unlocked = material.unlocked;
      } else {
        baseMaterial.resourceUrl = null;
        baseMaterial.enrollmentStatus = 'not_enrolled';
        baseMaterial.message = 'Resource access requires enrollment';
        baseMaterial.unlocked = material.unlocked;
      }

      return baseMaterial;
    });

    res.status(200).json(
      ApiResponse.success(transformedMaterials, 'Materials retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting materials by course (public):', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while retrieving materials')
    );
  }
});
