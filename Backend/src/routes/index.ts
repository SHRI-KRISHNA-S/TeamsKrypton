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
import apRoutes from './ap.routes';
import leaderboardRoutes from './leaderboard.routes';
import portfolioRoutes from './portfolio.routes';
import certificateRoutes from './certificate.routes';
import analyticsRoutes from './analytics.routes';
import adminRoutes from './admin.routes';

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
router.use('/ap', apRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/certificates', certificateRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export default router;
