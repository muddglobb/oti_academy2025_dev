import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import { CourseService } from '../services/course.service.js';

/**
 * @desc    Get all active courses
 * @route   GET /api/courses
 * @access  All authenticated users
 */
export const getCourses = asyncHandler(async (req, res) => {
  // Filter options
  const { level, search } = req.query;
  
  // Build filter object
  const filter = {};
  if (level) filter.level = level;
  if (search) {
    filter.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  const courses = await CourseService.getAllCourses(filter);
  
  res.status(200).json(
    ApiResponse.success(courses)
  );
});

/**
 * @desc    Get a course by ID
 * @route   GET /api/courses/:id
 * @access  All authenticated users
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const course = await CourseService.getCourseById(id);
    
    res.status(200).json(
      ApiResponse.success(course)
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

/**
 * @desc    Get multiple courses by IDs (for service-to-service communication)
 * @route   POST /api/courses/batch
 * @access  Service-to-service only
 */
export const getBatchCourses = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;
  
  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json(
      ApiResponse.error('courseIds array is required')
    );
  }
  
  if (courseIds.length > 50) {
    return res.status(400).json(
      ApiResponse.error('Maximum 50 courses allowed per batch request')
    );
  }
  
  try {
    const courses = await CourseService.getCoursesByIds(courseIds);
    
    res.status(200).json(
      ApiResponse.success(courses, 'Batch courses retrieved successfully')
    );
  } catch (error) {
    console.error('Error in getBatchCourses:', error);
    res.status(500).json(
      ApiResponse.error('Failed to retrieve batch courses')
    );
  }
});