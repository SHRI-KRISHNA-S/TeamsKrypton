import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import clubRoutes from './club.routes';
import membershipRoutes from './membership.routes';
import eventRoutes from './event.routes';
import attendanceRoutes from './attendance.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);
router.use('/memberships', membershipRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
