import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Retrieve overall or club-specific leaderboards with rankings
 *     tags: [Campus Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter leaderboard by department
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *         description: Filter leaderboard within a club (requires membership for student role)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search students by name or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page index for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page limit size
 *     responses:
 *       200:
 *         description: Ranked leaderboard listing returned
 */
router.get('/', requireAuth, leaderboardController.getLeaderboard);

export default router;
