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
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Caching time to live (30 minutes)
const packageCacheTTL = 2 * 60 * 60;

const serviceToServiceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Lebih tinggi untuk internal service
  message: { 
    status: 'error', 
    message: 'Terlalu banyak request dari service. Silakan coba lagi nanti.',
    errors: null
  },
skip: (req) => {
  // Check for valid API key in headers
  const apiKey = req.headers['x-api-key'];
  return apiKey && apiKey === process.env.INTERNAL_SERVICE_API_KEY;
}
});

router.route('/')
  .get(serviceToServiceLimiter, cacheMiddleware('packages', packageCacheTTL), getAllPackages)
  .post(authenticate, permit(Roles.ADMIN), invalidateCache('packages'), createPackage);

router.route('/:id')
  .get(serviceToServiceLimiter, cacheMiddleware('package', packageCacheTTL), getPackageById)
  .put(authenticate, permit(Roles.ADMIN), invalidateCache('package'), updatePackage)
  .delete(authenticate, permit(Roles.ADMIN), invalidateCache('package'), deletePackage);

export default router;