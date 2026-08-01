import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import clubRoutes from './club.routes';
import membershipRoutes from './membership.routes';
import eventRoutes from './event.routes';
import attendanceRoutes from './attendance.routes';
import postRoutes from './post.routes';
import opportunityRoutes from './opportunity.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);
router.use('/memberships', membershipRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/posts', postRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/notifications', notificationRoutes);

export default router;
