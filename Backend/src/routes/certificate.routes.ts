import { Router } from 'express';
import * as certificateController from '../controllers/certificate.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { issueCertificateSchema } from '../validations/certificate.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /certificates/issue:
 *   post:
 *     summary: Issue a verifiable student certificate (Faculty/Admin only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "student_user_uuid"
 *               title:
 *                 type: string
 *                 example: Excellence in Club Leadership
 *               metadata:
 *                 type: object
 *                 properties:
 *                   clubName:
 *                     type: string
 *                     example: Coding Club
 *     responses:
 *       201:
 *         description: Certificate issued and points awarded to the student
 */
router.post('/issue', requireAuth, requireRole(Role.FACULTY_COORDINATOR, Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), validate(issueCertificateSchema), certificateController.issueCertificate);

/**
 * @swagger
 * /certificates/verify/{uniqueId}:
 *   get:
 *     summary: Publicly verify a certificate authenticity by unique verification ID
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: uniqueId
 *         required: true
 *         schema:
 *           type: string
 *         example: "CERT-E12F3D"
 *     responses:
 *       200:
 *         description: Verification response payload returned
 *       404:
 *         description: Invalid certificate verification code
 */
router.get('/verify/:uniqueId', certificateController.verifyCertificate);

/**
 * @swagger
 * /certificates/history/{userId}:
 *   get:
 *     summary: Get all certificate history list for a student
 *     tags: [Certificates]
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
 *         description: History details returned
 */
router.get('/history/:userId', requireAuth, certificateController.getHistory);

export default router;
