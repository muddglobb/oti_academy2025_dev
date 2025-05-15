import express from 'express';
import materialRoutes from './material.routes.js';
import sectionRoutes from './section.routes.js';

const router = express.Router();

router.use('/materials', materialRoutes);
router.use('/sections', sectionRoutes);

export default router;