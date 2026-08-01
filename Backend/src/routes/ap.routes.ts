import { Router } from 'express';
import * as apController from '../controllers/ap.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { recordActivitySchema } from '../validations/ap.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /ap/record:
 *   post:
 *     summary: Log a points-earning activity transaction for a student
 *     tags: [Activity Points]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, activityType, description]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "student_user_uuid"
 *               activityType:
 *                 type: string
 *                 example: HACKATHON_WINNER
 *               description:
 *                 type: string
 *                 example: Won 1st place in the TechNova Hackathon.
 *               referenceId:
 *                 type: string
 *                 example: "hackathon_event_uuid"
 *     responses:
 *       201:
 *         description: Activity transaction recorded and user AP incremented
 */
router.post('/record', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.FACULTY_COORDINATOR, Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), validate(recordActivitySchema), apController.recordActivity);

/**
 * @swagger
 * /ap/transactions/{userId}:
 *   get:
 *     summary: Get all point transaction history logs for a user
 *     tags: [Activity Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Points transaction history returned
 */
router.get('/transactions/:userId', requireAuth, apController.getTransactions);

export default router;
