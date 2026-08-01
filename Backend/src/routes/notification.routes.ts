import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications returned
 */
router.get('/', requireAuth, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       404:
 *         description: Notification not found
 */
router.put('/:notificationId/read', requireAuth, notificationController.markAsRead);

export default router;
