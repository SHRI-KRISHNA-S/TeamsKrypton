import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { updateProfileSchema, searchUsersSchema } from '../validations/user.validation';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current authenticated user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', requireAuth, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update profile bio, skills list, and avatar URL
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "TypeScript", "Node.js"]
 *               bio:
 *                 type: string
 *                 example: "Student engineer. Active contributor to coding societies."
 *               avatar:
 *                 type: string
 *                 example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', requireAuth, validate(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search user directory by text keyword, department, or skill tag
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Matches user name or email
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Matches department exactly
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Matches tag in skills list
 *     responses:
 *       200:
 *         description: List of matching users returned
 */
router.get('/search', requireAuth, validate(searchUsersSchema), userController.searchUsers);

export default router;
