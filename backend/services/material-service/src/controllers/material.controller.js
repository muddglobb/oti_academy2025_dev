import { MaterialService } from '../services/material.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import config from '../config/index.js';

/**
 * @desc    Create a new material
 * @route   POST /api/materials
 * @access  Admin
 */
export const createMaterial = asyncHandler(async (req, res) => {
  const { 
    sectionId, 
    title, 
    description, 
    type, 
    content, 
    externalUrl, 
    order, 
    duration,
    status 
  } = req.body;

  // Validate input
  if (!sectionId || !title || !type) {
    return res.status(400).json(
      ApiResponse.error('Section ID, title, and type are required')
    );
  }

  // Get file URL if file uploaded
  let fileUrl = null;
  if (req.file) {
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const material = await MaterialService.createMaterial({
    sectionId,
    title,
    description,
    type,
    content,
    fileUrl,
    externalUrl,
    order: order ? parseInt(order) : undefined,
    duration: duration ? parseInt(duration) : null,
    status
  });

  res.status(201).json(
    ApiResponse.success(material, 'Material created successfully')
  );
});

/**
 * @desc    Get all materials for a section
 * @route   GET /api/materials/section/:sectionId
 * @access  Authenticated
 */
export const getMaterialsBySection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  const materials = await MaterialService.getMaterialsBySection(sectionId);

  res.status(200).json(
    ApiResponse.success(materials, 'Materials retrieved successfully')
  );
});

/**
 * @desc    Get material by ID
 * @route   GET /api/materials/:id
 * @access  Authenticated
 */
export const getMaterialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const material = await MaterialService.getMaterialById(id);

  if (!material) {
    return res.status(404).json(
      ApiResponse.error('Material not found')
    );
  }

  res.status(200).json(
    ApiResponse.success(material, 'Material retrieved successfully')
  );
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
    type, 
    content, 
    externalUrl, 
    order, 
    duration,
    status 
  } = req.body;

  // Check if material exists
  const existingMaterial = await MaterialService.getMaterialById(id);
  if (!existingMaterial) {
    return res.status(404).json(
      ApiResponse.error('Material not found')
    );
  }

  // Get file URL if file uploaded
  let fileUrl = existingMaterial.fileUrl;
  if (req.file) {
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const material = await MaterialService.updateMaterial(id, {
    title,
    description,
    type,
    content,
    fileUrl,
    externalUrl,
    order: order ? parseInt(order) : undefined,
    duration: duration ? parseInt(duration) : null,
    status
  });

  res.status(200).json(
    ApiResponse.success(material, 'Material updated successfully')
  );
});

/**
 * @desc    Delete material
 * @route   DELETE /api/materials/:id
 * @access  Admin
 */
export const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

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
});