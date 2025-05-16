import express from 'express';
import { authenticate, permit } from '../middlewares/auth.middleware.js';
import { validateSectionData } from '../middlewares/material.middleware.js';
import {
  createSection,
  getSection,
  getSectionsByCourse,
  updateSection,
  deleteSection,
  reorderSections
} from '../controllers/section.controller.js';
import { Roles } from '../utils/rbac/roles.js';

const router = express.Router();

// Public routes - none

// Protected routes - require authentication
router.use(authenticate);

// Student and admin routes
router.get('/:id', getSection);
router.get('/course/:courseId', getSectionsByCourse);

// Admin-only routes
router.post('/', permit(Roles.ADMIN), validateSectionData, createSection);
router.put('/:id', permit(Roles.ADMIN), validateSectionData, updateSection);
router.delete('/:id', permit(Roles.ADMIN), deleteSection);
router.put('/course/:courseId/reorder', permit(Roles.ADMIN), reorderSections);

export default router;