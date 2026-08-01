import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { 
  createEventSchema, 
  updateEventSchema, 
  addFeedbackSchema, 
  addEventGalleryItemSchema 
} from '../validations/event.validation';
import { Role } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events returned
 */
router.get('/', requireAuth, eventController.getEvents);

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Retrieve event details by ID
 *     tags: [Events]
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
 *         description: Event details retrieved
 *       404:
 *         description: Event not found
 */
router.get('/:eventId', requireAuth, eventController.getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Request creation of a new club event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date, venue, capacity, clubId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: RoboWars 2026
 *               description:
 *                 type: string
 *                 example: Combat robotics workshop and competitive challenges.
 *               date:
 *                 type: string
 *                 example: "2026-10-15T09:00:00.000Z"
 *               venue:
 *                 type: string
 *                 example: Main Campus Auditorium
 *               capacity:
 *                 type: number
 *                 example: 150
 *               clubId:
 *                 type: string
 *                 example: "some_club_uuid_string"
 *     responses:
 *       201:
 *         description: Event created, pending approval
 */
router.post('/', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(createEventSchema), eventController.createEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     summary: Update event parameters (venue, date, capacity, details)
 *     tags: [Events]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event parameters updated successfully
 */
router.put('/:eventId', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(updateEventSchema), eventController.updateEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     summary: Cancel and delete an event
 *     tags: [Events]
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
 *         description: Event deleted successfully
 */
router.delete('/:eventId', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), eventController.deleteEvent);

/**
 * @swagger
 * /events/{eventId}/approve:
 *   post:
 *     summary: Approve event requests to list on active calendars
 *     tags: [Events]
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
 *         description: Event approved successfully
 */
router.post('/:eventId/approve', requireAuth, requireRole(Role.FACULTY_COORDINATOR, Role.COLLEGE_ADMIN, Role.SUPER_ADMIN), eventController.approveEvent);

/**
 * @swagger
 * /events/{eventId}/register:
 *   post:
 *     summary: Register the current user for an approved event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Capacity filled or unapproved event
 *       409:
 *         description: Already registered
 */
router.post('/:eventId/register', requireAuth, eventController.registerUser);

/**
 * @swagger
 * /events/{eventId}/feedback:
 *   post:
 *     summary: Submit feedback rating and comments for an event
 *     tags: [Events]
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
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comments:
 *                 type: string
 *                 example: "Fantastic hands-on workshops!"
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/:eventId/feedback', requireAuth, validate(addFeedbackSchema), eventController.addFeedback);

/**
 * @swagger
 * /events/{eventId}/feedbacks:
 *   get:
 *     summary: Get all feedbacks for an event
 *     tags: [Events]
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
 *         description: Feedback lists returned
 */
router.get('/:eventId/feedbacks', requireAuth, eventController.getFeedbacks);

/**
 * @swagger
 * /events/{eventId}/gallery:
 *   post:
 *     summary: Add media image to event gallery
 *     tags: [Events]
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
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
 *     responses:
 *       201:
 *         description: Media item uploaded successfully
 */
router.post('/:eventId/gallery', requireAuth, requireRole(Role.CLUB_PRESIDENT, Role.SUPER_ADMIN), validate(addEventGalleryItemSchema), eventController.addGalleryItem);

/**
 * @swagger
 * /events/{eventId}/gallery:
 *   get:
 *     summary: Get all gallery items for an event
 *     tags: [Events]
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
 *         description: List of gallery items returned
 */
router.get('/:eventId/gallery', requireAuth, eventController.getGallery);

export default router;
