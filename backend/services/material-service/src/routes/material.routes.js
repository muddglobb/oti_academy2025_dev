import express from 'express';
import { authenticate } from '../utils/rbac/auth.js';
import { permit } from '../utils/rbac/permit.js';
import { validateMaterialData } from '../middlewares/material.middleware.js';
import { verifyEnrollmentEnhanced } from '../middlewares/enrollment-enhanced.middleware.js';
import { verifyMaterialEnrollmentEnhanced } from '../middlewares/material-enrollment-enhanced.middleware.js';
import {
  createMaterial,
  getAllMaterials,
  getMaterial,
  getMaterialsByCourse,
  updateMaterial,
  deleteMaterial
} from '../controllers/material.controller.js';
import { Roles } from '../utils/rbac/roles.js';

const router = express.Router();

// Public routes - none

// Protected routes - require authentication
router.use(authenticate);

// Student and admin routes
router.get('/course/:courseId', verifyEnrollmentEnhanced, getMaterialsByCourse);
router.get('/:id', verifyMaterialEnrollmentEnhanced, getMaterial);

// Admin-only routes
router.get('/', permit(Roles.ADMIN), getAllMaterials);
router.post('/', permit(Roles.ADMIN), validateMaterialData, createMaterial);
router.put('/:id', permit(Roles.ADMIN), validateMaterialData, updateMaterial);
router.delete('/:id', permit(Roles.ADMIN), deleteMaterial);

export default router;