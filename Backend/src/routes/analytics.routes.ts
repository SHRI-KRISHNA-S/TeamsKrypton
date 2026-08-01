import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Retrieve aggregate charts and platform summary metrics (Admin/Super Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consolidated dashboard statistics returned
 */
router.get('/dashboard', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), analyticsController.getDashboardAnalytics);

export default router;
