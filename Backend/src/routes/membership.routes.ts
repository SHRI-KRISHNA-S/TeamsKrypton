import { Router } from 'express';
import * as membershipController from '../controllers/membership.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /memberships/clubs/{clubId}/join:
 *   post:
 *     summary: Submit a membership join application to a club
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       409:
 *         description: Application already exists or is active
 */
router.post('/clubs/:clubId/join', requireAuth, membershipController.joinClub);

/**
 * @swagger
 * /memberships/{membershipId}/approve:
 *   post:
 *     summary: Approve a pending membership request
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application approved successfully
 */
router.post('/:membershipId/approve', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), membershipController.approveMembership);

/**
 * @swagger
 * /memberships/{membershipId}/reject:
 *   post:
 *     summary: Reject a pending membership request
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application rejected successfully
 */
router.post('/:membershipId/reject', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), membershipController.rejectMembership);

/**
 * @swagger
 * /memberships/{membershipId}:
 *   delete:
 *     summary: Remove a member from the club (revoke membership)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 */
router.delete('/:membershipId', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), membershipController.removeMember);

/**
 * @swagger
 * /memberships/clubs/{clubId}/members:
 *   get:
 *     summary: Get all approved members of a club
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Club members list retrieved successfully
 */
router.get('/clubs/:clubId/members', requireAuth, membershipController.getMembers);

export default router;
