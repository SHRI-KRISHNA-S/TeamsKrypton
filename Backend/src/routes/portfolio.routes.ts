import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { addProjectSchema, addAchievementSchema } from '../validations/portfolio.validation';

const router = Router();

/**
 * @swagger
 * /portfolio/export:
 *   get:
 *     summary: Export current authenticated student's portfolio context in JSON format
 *     tags: [Student Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio download file context returned
 */
router.get('/export', requireAuth, portfolioController.exportPortfolio);

/**
 * @swagger
 * /portfolio/{userId}:
 *   get:
 *     summary: Retrieve consolidated resume-like portfolio summary for a student
 *     tags: [Student Portfolio]
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
 *         description: Student portfolio details returned
 *       404:
 *         description: Student profile not found
 */
router.get('/:userId', requireAuth, portfolioController.getPortfolio);

/**
 * @swagger
 * /portfolio/projects:
 *   post:
 *     summary: Add project listing to portfolio
 *     tags: [Student Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Campus Management System
 *               description:
 *                 type: string
 *                 example: Multi-tenant student and clubs directory portal.
 *               link:
 *                 type: string
 *                 example: "https://github.com/my-profile/project"
 *     responses:
 *       201:
 *         description: Project logged successfully
 */
router.post('/projects', requireAuth, validate(addProjectSchema), portfolioController.addProject);

/**
 * @swagger
 * /portfolio/achievements:
 *   post:
 *     summary: Add achievement log to portfolio
 *     tags: [Student Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Coding Hackathon Champion
 *               description:
 *                 type: string
 *                 example: Won 1st place among 100 teams in algorithms.
 *               date:
 *                 type: string
 *                 example: "2026-07-28T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Achievement logged successfully
 */
router.post('/achievements', requireAuth, validate(addAchievementSchema), portfolioController.addAchievement);

export default router;
