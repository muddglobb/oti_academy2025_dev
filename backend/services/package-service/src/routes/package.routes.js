import { Router } from 'express';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../controllers/package.controller.js';
import { authenticate, permit, Roles } from '../config/auth.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = Router();

// Caching time to live (30 minutes)
const packageCacheTTL = 30 * 60;

// Route: /packages
router.route('/')
  .get(cacheMiddleware('packages', packageCacheTTL), getAllPackages) // Semua role bisa mengakses dengan cache
  .post(authenticate, permit(Roles.ADMIN), invalidateCache('packages'), createPackage); // Hanya ADMIN, invalidate cache setelah create

// Route: /packages/:id
router.route('/:id')
  .get(cacheMiddleware('package', packageCacheTTL), getPackageById) // Semua role bisa mengakses dengan cache
  .put(authenticate, permit(Roles.ADMIN), invalidateCache('package'), updatePackage) // Hanya ADMIN, invalidate cache setelah update
  .delete(authenticate, permit(Roles.ADMIN), invalidateCache('package'), deletePackage); // Hanya ADMIN, invalidate cache setelah delete

export default router;