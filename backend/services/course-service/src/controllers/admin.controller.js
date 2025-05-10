import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import { CourseService } from '../services/course.service.js';
import config from '../config/index.js';

/**
 * @desc    Create a new course
 * @route   POST /api/admin/courses
 * @access  Admin only
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, level, quota, entryQuota, bundleQuota } = req.body;
  
  // Validation
  if (!title || !description) {
    return res.status(400).json(
      ApiResponse.error('Please provide course title and description')
    );
  }
    // Set default quota values
  const totalQuota = quota || config.DEFAULT_COURSE_QUOTA;
  
  // Special handling for Game Dev and Competitive Programming
  let defaultEntryQuota;
  let defaultBundleQuota;
  
  if (title === 'Game Development' || title === 'Competitive Programming') {
    // These courses have full quota for entry level and no bundle quota
    defaultEntryQuota = totalQuota;
    defaultBundleQuota = 0;
  } else {
    // Other courses have 110/140 (~78.6%) for entry level and 30/140 (~21.4%) for bundle
    defaultEntryQuota = Math.floor(totalQuota * 0.786); // ~110/140
    defaultBundleQuota = Math.floor(totalQuota * 0.214); // ~30/140
  }
  
  // Create course
  const course = await CourseService.createCourse({
    title,
    description,
    level: level || 'ENTRY',
    quota: totalQuota,
    entryQuota: entryQuota || defaultEntryQuota,
    bundleQuota: bundleQuota || defaultBundleQuota
  });
  
  res.status(201).json(
    ApiResponse.success(course, 'Course created successfully')
  );
});

/**
 * @desc    Update a course
 * @route   PUT /api/admin/courses/:id
 * @access  Admin only
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, level, quota, entryQuota, bundleQuota } = req.body;
  
  try {
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (level !== undefined) updateData.level = level;
      // Handle quota updates
    if (quota !== undefined) {
      updateData.quota = quota;
      
      // Get existing course to check title
      const course = await CourseService.getCourseById(id);
      
      // Recalculate entry and bundle quotas if they weren't explicitly provided
      if (entryQuota === undefined && bundleQuota === undefined) {
        // Check if it's one of the special courses (or being updated to one)
        if (title === 'Game Development' || title === 'Competitive Programming' || 
            (title === undefined && (course.title === 'Game Development' || course.title === 'Competitive Programming'))) {
          updateData.entryQuota = quota;  // All quota for entry level
          updateData.bundleQuota = 0;     // No bundle quota
        } else {
          updateData.entryQuota = Math.floor(quota * 0.786);  // ~110/140 for entry level
          updateData.bundleQuota = Math.floor(quota * 0.214); // ~30/140 for bundle
        }
      }
    }
    
    if (entryQuota !== undefined) updateData.entryQuota = entryQuota;
    if (bundleQuota !== undefined) updateData.bundleQuota = bundleQuota;
    
    const updatedCourse = await CourseService.updateCourse(id, updateData);
    
    res.status(200).json(
      ApiResponse.success(updatedCourse, 'Course updated successfully')
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
 * @desc    Delete a course
 * @route   DELETE /api/admin/courses/:id
 * @access  Admin only
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    await CourseService.deleteCourse(id);
    
    res.status(200).json(
      ApiResponse.success(null, 'Course deleted successfully')
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
 * @desc    Get all courses (admin view with full details)
 * @route   GET /api/admin/courses
 * @access  Admin only
 */
export const getAllCourses = asyncHandler(async (req, res) => {
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
 * @desc    Get a course by ID (admin view with full details)
 * @route   GET /api/admin/courses/:id
 * @access  Admin only
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