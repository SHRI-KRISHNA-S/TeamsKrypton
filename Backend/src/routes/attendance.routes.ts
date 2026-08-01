import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { markQrAttendanceSchema, markManualAttendanceSchema } from '../validations/attendance.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /attendance/events/{eventId}/qr:
 *   post:
 *     summary: Scan QR code token to register attendance check-in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qrToken]
 *             properties:
 *               qrToken:
 *                 type: string
 *                 example: "some_event_uuid_used_as_qr_token"
 *     responses:
 *       201:
 *         description: QR attendance checked-in successfully
 *       400:
 *         description: Missing token or user unregistered
 *       409:
 *         description: Already checked-in
 */
router.post('/events/:eventId/qr', requireAuth, validate(markQrAttendanceSchema), attendanceController.markQrAttendance);

/**
 * @swagger
 * /attendance/events/{eventId}/manual:
 *   post:
 *     summary: Manually register check-in for a student (Exec/Admin override)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "student_user_uuid"
 *               method:
 *                 type: string
 *                 enum: [QR, MANUAL]
 *                 example: MANUAL
 *     responses:
 *       201:
 *         description: Attendance registered manually successfully
 */
router.post('/events/:eventId/manual', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(markManualAttendanceSchema), attendanceController.markManualAttendance);

/**
 * @swagger
 * /attendance/events/{eventId}/report:
 *   get:
 *     summary: Retrieve checklist report of all checked-in attendees for an event
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of attendees returned
 */
router.get('/events/:eventId/report', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.FACULTY_COORDINATOR, Role.SUPER_ADMIN), attendanceController.getReport);

export default router;
