import { Router } from 'express';
import * as clubController from '../controllers/club.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { createClubSchema, updateClubSchema, addGalleryItemSchema } from '../validations/club.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Discover list of all approved campus clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved clubs returned
 */
router.get('/', requireAuth, clubController.getClubs);

/**
 * @swagger
 * /clubs/{clubId}:
 *   get:
 *     summary: Retrieve club details by ID
 *     tags: [Clubs]
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
 *         description: Club details retrieved
 *       404:
 *         description: Club not found
 */
router.get('/:clubId', requireAuth, clubController.getClubById);

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Submit a new club creation request
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, category]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coding Club
 *               description:
 *                 type: string
 *                 example: The premier coding society for programmers.
 *               category:
 *                 type: string
 *                 example: Technical
 *               logo:
 *                 type: string
 *                 example: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=150"
 *               banner:
 *                 type: string
 *                 example: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
 *     responses:
 *       201:
 *         description: Club request created, pending admin approval
 */
router.post('/', requireAuth, validate(createClubSchema), clubController.createClub);

/**
 * @swagger
 * /clubs/{clubId}:
 *   put:
 *     summary: Update club parameters (logo, banner, category, description)
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               logo:
 *                 type: string
 *               banner:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club parameters updated successfully
 */
router.put('/:clubId', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(updateClubSchema), clubController.updateClub);

/**
 * @swagger
 * /clubs/{clubId}:
 *   delete:
 *     summary: Delete a club
 *     tags: [Clubs]
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
 *         description: Club deleted successfully
 */
router.delete('/:clubId', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), clubController.deleteClub);

/**
 * @swagger
 * /clubs/{clubId}/approve:
 *   post:
 *     summary: Approve a pending club request
 *     tags: [Clubs]
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
 *         description: Club approved successfully
 */
router.post('/:clubId/approve', requireAuth, requireRole(Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), clubController.approveClub);

/**
 * @swagger
 * /clubs/{clubId}/gallery:
 *   post:
 *     summary: Add media image to club gallery
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
 *     responses:
 *       201:
 *         description: Media item uploaded successfully
 */
router.post('/:clubId/gallery', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(addGalleryItemSchema), clubController.addGalleryItem);

/**
 * @swagger
 * /clubs/{clubId}/gallery:
 *   get:
 *     summary: Get all gallery items for a club
 *     tags: [Clubs]
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
 *         description: List of gallery items returned
 */
router.get('/:clubId/gallery', requireAuth, clubController.getGallery);

export default router;
