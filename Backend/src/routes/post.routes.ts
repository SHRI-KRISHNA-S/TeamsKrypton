import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { createPostSchema, createCommentSchema } from '../validations/post.validation';

const router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve college feed and club feed posts matching user memberships
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Merged list of posts returned
 */
router.get('/', requireAuth, postController.getFeed);

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Retrieve single post details and comments list by ID
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details retrieved
 *       404:
 *         description: Post not found
 */
router.get('/:postId', requireAuth, postController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Publish a new post to the college or club feed
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: RoboCup Winners!
 *               content:
 *                 type: string
 *                 example: We won first place at the national RoboCup event!
 *               clubId:
 *                 type: string
 *                 description: Set if posting to club feed, must have approved executive membership.
 *                 example: "club_uuid_string"
 *     responses:
 *       201:
 *         description: Post published successfully
 *       403:
 *         description: Forbidden to post to this club
 */
router.post('/', requireAuth, validate(createPostSchema), postController.createPost);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Comment on a post
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: Congratulations team! Well deserved.
 *     responses:
 *       201:
 *         description: Comment published successfully
 */
router.post('/:postId/comments', requireAuth, validate(createCommentSchema), postController.addComment);

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Toggle like status on a post
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/:postId/like', requireAuth, postController.toggleLike);

/**
 * @swagger
 * /posts/{postId}/bookmark:
 *   post:
 *     summary: Toggle bookmark status on a post
 *     tags: [Campus Connect]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/:postId/bookmark', requireAuth, postController.toggleBookmark);
router.delete('/:postId', requireAuth, postController.deletePost);

export default router;
