import { Router } from 'express';
import * as opportunityController from '../controllers/opportunity.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { createOpportunitySchema, applyOpportunitySchema } from '../validations/opportunity.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /opportunities:
 *   get:
 *     summary: Browse available opportunities filtered by type query
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [HACKATHON, COMPETITION, INTERNSHIP, RECRUITMENT, SCHOLARSHIP]
 *     responses:
 *       200:
 *         description: List of opportunities returned
 */
router.get('/', requireAuth, opportunityController.getOpportunities);

/**
 * @swagger
 * /opportunities:
 *   post:
 *     summary: Post a new campus opportunity (Admin/Super Admin only)
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, deadline]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Winter Software Internship
 *               description:
 *                 type: string
 *                 example: 3-month software engineering role.
 *               type:
 *                 type: string
 *                 enum: [HACKATHON, COMPETITION, INTERNSHIP, RECRUITMENT, SCHOLARSHIP]
 *                 example: INTERNSHIP
 *               company:
 *                 type: string
 *                 example: Google
 *               deadline:
 *                 type: string
 *                 example: "2026-12-01T23:59:59.000Z"
 *               location:
 *                 type: string
 *                 example: Remote
 *               requirements:
 *                 type: string
 *                 example: Proficiency in TypeScript and SQL.
 *               link:
 *                 type: string
 *                 example: "https://careers.google.com"
 *     responses:
 *       201:
 *         description: Opportunity posted successfully
 */
router.post('/', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), validate(createOpportunitySchema), opportunityController.createOpportunity);

/**
 * @swagger
 * /opportunities/{oppId}/apply:
 *   post:
 *     summary: Apply for a posted opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oppId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeUrl:
 *                 type: string
 *                 example: "https://drive.google.com/file/d/my_resume"
 *     responses:
 *       201:
 *         description: Applied successfully
 *       409:
 *         description: Already applied
 */
router.post('/:oppId/apply', requireAuth, validate(applyOpportunitySchema), opportunityController.applyOpportunity);

/**
 * @swagger
 * /opportunities/{oppId}/applications:
 *   get:
 *     summary: Get all student applications for an opportunity (Admin/Super Admin only)
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oppId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application records list retrieved successfully
 */
router.get('/:oppId/applications', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), opportunityController.getApplications);

export default router;
