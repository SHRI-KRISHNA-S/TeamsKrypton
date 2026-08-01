import { prisma } from '../config/db';
import { Certificate } from '@prisma/client';

export class CertificateRepository {
  async issueCertificate(data: { uniqueId: string; userId: string; title: string; issuedBy: string; issueDate: Date; metadata?: any }): Promise<Certificate> {
    return prisma.certificate.create({
      data,
    });
  }

  async findByUniqueId(uniqueId: string): Promise<any | null> {
    return prisma.certificate.findUnique({
      where: { uniqueId },
      include: {
        user: { select: { name: true, email: true, department: true } },
      },
    });
  }

  async getHistoryByUserId(userId: string): Promise<Certificate[]> {
    return prisma.certificate.findMany({
      where: { userId },
      orderBy: { issueDate: 'desc' },
    });
  }
}
