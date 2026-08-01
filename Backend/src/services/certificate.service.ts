import { CertificateRepository } from '../repositories/certificate.repository';
import { storageService } from './storage.service';
import { prisma } from '../config/db';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors';
import { NotificationType } from '@prisma/client';

const certificateRepo = new CertificateRepository();

// Helper to determine Activity Points based on category
export function calculateActivityPoints(category: string): number {
  switch (category.toLowerCase()) {
    case 'hackathon':
      return 500;
    case 'competition':
      return 200;
    case 'internship':
      return 100;
    case 'volunteer':
      return 75;
    case 'workshop':
      return 50;
    case 'academic':
      return 150;
    case 'course completion':
      return 100;
    case 'leadership':
      return 200;
    case 'research':
      return 250;
    default:
      return 50;
  }
}

export const certificateService = {
  uploadCertificate: async (
    userId: string,
    metadata: {
      title: string;
      issuedBy: string;
      issueDate: string;
      category: string;
      description?: string;
      skills?: string[];
      expiryDate?: string;
      verificationUrl?: string;
      certificateId?: string;
    },
    file: {
      filename: string;
      mimetype: string;
      size: number;
    }
  ) => {
    if (!file) {
      throw new BadRequestError('Certificate document is required.');
    }

    const uniqueId = metadata.certificateId || `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const documentUrl = storageService.getFileUrl(file.filename);
    const activityPoints = calculateActivityPoints(metadata.category);

    return certificateRepo.create({
      uniqueId,
      userId,
      title: metadata.title,
      issuedBy: metadata.issuedBy,
      issueDate: new Date(metadata.issueDate),
      category: metadata.category,
      description: metadata.description || '',
      skills: metadata.skills || [],
      expiryDate: metadata.expiryDate ? new Date(metadata.expiryDate) : null,
      verificationUrl: metadata.verificationUrl || '',
      documentUrl,
      documentType: file.mimetype,
      fileSize: file.size,
      activityPoints,
      status: 'PENDING',
    });
  },

  getCertificates: async (userId: string, role: string) => {
    // If student, list only own certificates. Otherwise, return all
    if (role === 'STUDENT') {
      return certificateRepo.findMany({ userId });
    }
    return certificateRepo.findMany({});
  },

  getCertificateById: async (id: string, userId: string, role: string) => {
    const certificate = await certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found.');
    }

    if (role === 'STUDENT' && certificate.userId !== userId) {
      throw new ForbiddenError('Access Denied.');
    }

    return certificate;
  },

  updateCertificate: async (
    id: string,
    userId: string,
    role: string,
    updates: {
      title?: string;
      issuedBy?: string;
      issueDate?: string;
      category?: string;
      description?: string;
      skills?: string[];
      expiryDate?: string;
      verificationUrl?: string;
    }
  ) => {
    const certificate = await certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found.');
    }

    if (role === 'STUDENT' && certificate.userId !== userId) {
      throw new ForbiddenError('You are not authorized to edit this certificate.');
    }

    if (certificate.status !== 'PENDING') {
      throw new BadRequestError('Only pending certificates can be modified.');
    }

    const data: any = { ...updates };
    if (updates.issueDate) data.issueDate = new Date(updates.issueDate);
    if (updates.expiryDate) data.expiryDate = new Date(updates.expiryDate);
    if (updates.category) data.activityPoints = calculateActivityPoints(updates.category);

    return certificateRepo.update(id, data);
  },

  deleteCertificate: async (id: string, userId: string, role: string) => {
    const certificate = await certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found.');
    }

    if (role === 'STUDENT' && certificate.userId !== userId) {
      throw new ForbiddenError('Access Denied.');
    }

    // Delete file from disk
    if (certificate.documentUrl) {
      await storageService.deleteFile(certificate.documentUrl);
    }

    return certificateRepo.delete(id);
  },

  approveCertificate: async (
    id: string,
    approvedBy: string,
    remarks?: string
  ) => {
    const certificate = await certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found.');
    }

    if (certificate.status === 'APPROVED') {
      throw new BadRequestError('Certificate is already approved.');
    }

    // Award activity points inside a transaction
    return prisma.$transaction(async (tx) => {
      const updatedCert = await tx.certificate.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy,
          approvedAt: new Date(),
          remarks: remarks || 'Approved by Faculty',
        },
      });

      // Update User Activity Points (totalAp)
      await tx.user.update({
        where: { id: certificate.userId },
        data: {
          totalAp: {
            increment: certificate.activityPoints,
          },
        },
      });

      // Record Activity Transaction Ledger entry
      await tx.activityTransaction.create({
        data: {
          userId: certificate.userId,
          activityType: `CERTIFICATE_${certificate.category.toUpperCase().replace(/ /g, '_')}`,
          points: certificate.activityPoints,
          description: `Verified certificate: ${certificate.title}`,
          referenceId: certificate.id,
          createdBy: approvedBy,
        },
      });

      // Notify the recipient student
      await tx.notification.create({
        data: {
          userId: certificate.userId,
          title: 'Certificate Approved',
          message: `Your certificate "${certificate.title}" has been approved! Earning +${certificate.activityPoints} Activity Points.`,
          type: NotificationType.MEMBERSHIP_UPDATE,
        },
      });

      return updatedCert;
    });
  },

  rejectCertificate: async (
    id: string,
    rejectedBy: string,
    remarks: string
  ) => {
    if (!remarks) {
      throw new BadRequestError('Rejection remarks/comments are required.');
    }

    const certificate = await certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found.');
    }

    if (certificate.status !== 'PENDING') {
      throw new BadRequestError('Only pending certificates can be rejected.');
    }

    return prisma.$transaction(async (tx) => {
      const updatedCert = await tx.certificate.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: rejectedBy,
          approvedAt: new Date(),
          remarks,
        },
      });

      // Notify the recipient student
      await tx.notification.create({
        data: {
          userId: certificate.userId,
          title: 'Certificate Rejected',
          message: `Your certificate "${certificate.title}" has been rejected. Reason: ${remarks}`,
          type: NotificationType.MEMBERSHIP_UPDATE,
        },
      });

      return updatedCert;
    });
  },
};
