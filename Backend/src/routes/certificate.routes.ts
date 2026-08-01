import { Router } from 'express';
import * as certificateController from '../controllers/certificate.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { uploadCertificate } from '../middleware/upload';
import { Role } from '@prisma/client';

const router = Router();

// Base Protected Routes
router.post(
  '/upload',
  requireAuth,
  uploadCertificate.single('file'),
  certificateController.uploadCertificate
);

router.get('/', requireAuth, certificateController.getCertificates);
router.get('/:id', requireAuth, certificateController.getCertificateById);
router.put('/:id', requireAuth, certificateController.updateCertificate);
router.delete('/:id', requireAuth, certificateController.deleteCertificate);

// Approvals & Moderation (Faculty Coordinators, College Admins, Super Admins only)
router.post(
  '/:id/approve',
  requireAuth,
  requireRole(Role.FACULTY_COORDINATOR, Role.COLLEGE_ADMIN, Role.SUPER_ADMIN),
  certificateController.approveCertificate
);

router.post(
  '/:id/reject',
  requireAuth,
  requireRole(Role.FACULTY_COORDINATOR, Role.COLLEGE_ADMIN, Role.SUPER_ADMIN),
  certificateController.rejectCertificate
);

export default router;
