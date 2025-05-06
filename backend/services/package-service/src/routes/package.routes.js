import { Router } from 'express';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../controllers/package.controller.js';
import { authenticate, permit, Roles } from '../config/auth.js';

const router = Router();

// Route: /packages
router.route('/')
  .get(authenticate, getAllPackages) // Semua role bisa mengakses
  .post(authenticate, permit(Roles.ADMIN), createPackage); // Hanya ADMIN 

// Route: /packages/:id
router.route('/:id')
  .get(authenticate, getPackageById) // Semua role bisa mengakses
  .put(authenticate, permit(Roles.ADMIN), updatePackage) // Hanya ADMIN
  .delete(authenticate, permit(Roles.ADMIN), deletePackage); // Hanya ADMIN

export default router;