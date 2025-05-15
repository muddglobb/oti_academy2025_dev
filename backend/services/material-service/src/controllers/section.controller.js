import { SectionService } from '../services/section.service.js';
import { MaterialService } from '../services/material.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';

// @desc    Create new section
// @route   POST /api/sections
// @access  Admin
export const createSection = asyncHandler(async (req, res) => {
  try {
    const section = await SectionService.createSection(req.body);

    res.status(201).json(
      ApiResponse.success(section, 'Section created successfully')
    );
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    
    throw error;
  }
});

// @desc    Get section by ID
// @route   GET /api/sections/:id
// @access  Authenticated
export const getSection = asyncHandler(async (req, res) => {
  const section = await SectionService.getSectionById(req.params.id);

  if (!section) {
    return res.status(404).json(
      ApiResponse.error('Section not found')
    );
  }

  // Get materials for this section
  const materials = await MaterialService.getMaterialsBySection(section.id);

  res.status(200).json(
    ApiResponse.success({
      ...section,
      materials
    })
  );
});

// @desc    Get sections by course
// @route   GET /api/sections/course/:courseId
// @access  Authenticated
export const getSectionsByCourse = asyncHandler(async (req, res) => {
  try {
    const sections = await SectionService.getSectionsByCourse(req.params.courseId);

    res.status(200).json(
      ApiResponse.success(sections)
    );
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    
    throw error;
  }
});

// @desc    Update section
// @route   PUT /api/sections/:id
// @access  Admin
export const updateSection = asyncHandler(async (req, res) => {
  try {
    const section = await SectionService.updateSection(req.params.id, req.body);

    res.status(200).json(
      ApiResponse.success(section, 'Section updated successfully')
    );
  } catch (error) {
    if (error.message === 'Section not found') {
      return res.status(404).json(
        ApiResponse.error('Section not found')
      );
    }
    
    throw error;
  }
});

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Admin
export const deleteSection = asyncHandler(async (req, res) => {
  try {
    await SectionService.deleteSection(req.params.id);

    res.status(200).json(
      ApiResponse.success(null, 'Section deleted successfully')
    );
  } catch (error) {
    if (error.message === 'Section not found') {
      return res.status(404).json(
        ApiResponse.error('Section not found')
      );
    }
    
    throw error;
  }
});

// @desc    Reorder sections for a course
// @route   PUT /api/sections/course/:courseId/reorder
// @access  Admin
export const reorderSections = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json(
      ApiResponse.error('orderedIds must be an array of section IDs')
    );
  }

  try {
    const updatedSections = await SectionService.reorderSections(courseId, orderedIds);

    res.status(200).json(
      ApiResponse.success(updatedSections, 'Sections reordered successfully')
    );
  } catch (error) {
    if (error.message === 'Invalid section IDs provided') {
      return res.status(400).json(
        ApiResponse.error(error.message)
      );
    }
    
    throw error;
  }
});