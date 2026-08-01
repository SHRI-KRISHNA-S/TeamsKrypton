import { CertificateRepository } from '../repositories/certificate.repository';
import { ApService } from './ap.service';
import { Certificate } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import crypto from 'crypto';

export class CertificateService {
  private certificateRepository = new CertificateRepository();
  private apService = new ApService();

  async issueCertificate(
    userId: string,
    title: string,
    issuedBy: string,
    metadata?: any
  ): Promise<Certificate> {
    const uniqueId = 'CERT-' + crypto.randomBytes(6).toString('hex').toUpperCase();

    const certificate = await this.certificateRepository.issueCertificate({
      uniqueId,
      userId,
      title,
      issuedBy,
      issueDate: new Date(),
      metadata,
    });

    // Automatically award AP to the user
    await this.apService.recordActivity(
      userId,
      'CERTIFICATE_EARNED',
      `Earned certificate: ${title}`,
      issuedBy,
      certificate.id
    );

    return certificate;
  }

  async verifyCertificate(uniqueId: string): Promise<any> {
    const certificate = await this.certificateRepository.findByUniqueId(uniqueId);
    if (!certificate) {
      throw new NotFoundError('Certificate verification failed: Invalid ID');
    }
    return {
      isValid: true,
      certificate: {
        id: certificate.id,
        uniqueId: certificate.uniqueId,
        title: certificate.title,
        issuedBy: certificate.issuedBy,
        issueDate: certificate.issueDate,
        recipient: certificate.user,
      },
    };
  }

  async getHistory(userId: string): Promise<Certificate[]> {
    return this.certificateRepository.getHistoryByUserId(userId);
  }
}
