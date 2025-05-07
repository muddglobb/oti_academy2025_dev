import { Router } from 'express';
import {
  createSession,
  updateSession,
  deleteSession
} from '../controllers/session.controller.js';
import { authenticate, authorizeRoles } from '../config/auth.js';
import { Roles } from '../libs/roles.js';

const router = Router();

// Admin-only operations on sessions
router.use(authenticate);
router.use(authorizeRoles(Roles.ADMIN));

router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;