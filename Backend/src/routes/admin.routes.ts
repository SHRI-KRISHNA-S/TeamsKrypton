import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { updateSettingSchema } from '../validations/admin.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /admin/dashboard-stats:
 *   get:
 *     summary: Retrieve checklist pending items and registrations (College Admin/Super Admin)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats summary list returned
 */
router.get('/dashboard-stats', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), adminController.getDashboardStatistics);

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Retrieve system security audit log list (Super Admin only)
 *     tags: [Super Admin Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Audit records returned
 */
router.get('/audit-logs', requireAuth, requireRole(Role.SUPER_ADMIN), adminController.getAuditLogs);

/**
 * @swagger
 * /admin/settings:
 *   put:
 *     summary: Update global platform constants (Super Admin only)
 *     tags: [Super Admin Tools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key:
 *                 type: string
 *                 example: ALLOW_NEW_REGISTRATIONS
 *               value:
 *                 type: string
 *                 example: "true"
 *     responses:
 *       200:
 *         description: Global settings modified successfully
 */
router.put('/settings', requireAuth, requireRole(Role.SUPER_ADMIN), validate(updateSettingSchema), adminController.updateGlobalSetting);

/**
 * @swagger
 * /admin/platform-stats:
 *   get:
 *     summary: Get overall statistics of users, roles, and databases (Super Admin only)
 *     tags: [Super Admin Tools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System metric counts returned
 */
router.get('/platform-stats', requireAuth, requireRole(Role.SUPER_ADMIN), adminController.getPlatformStats);

export default router;
