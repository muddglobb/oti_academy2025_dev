import express from 'express';
import { authenticate, permit } from '../middlewares/auth.middleware.js';
import { handleUpload } from '../middlewares/upload.middleware.js';
import { validateMaterialData } from '../middlewares/material.middleware.js';
import {
  createMaterial,
  getMaterial,
  getMaterialsBySection,
  updateMaterial,
  deleteMaterial,
  uploadMaterialFile
} from '../controllers/material.controller.js';
import { Roles } from '../utils/rbac/roles.js';

const router = express.Router();

// Public routes - none

// Protected routes - require authentication
router.use(authenticate);

// Student and admin routes
router.get('/:id', getMaterial);
router.get('/section/:sectionId', getMaterialsBySection);

// Admin-only routes
router.post('/', permit(Roles.ADMIN), validateMaterialData, createMaterial);
router.put('/:id', permit(Roles.ADMIN), validateMaterialData, updateMaterial);
router.delete('/:id', permit(Roles.ADMIN), deleteMaterial);
router.post('/upload', permit(Roles.ADMIN), handleUpload, uploadMaterialFile);

export default router;