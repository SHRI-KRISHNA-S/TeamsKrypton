import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export class CertificateRepository {
  async create(data: Prisma.CertificateUncheckedCreateInput) {
    return prisma.certificate.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true,
          },
        },
      },
    });
  }

  async findMany(where: Prisma.CertificateWhereInput) {
    return prisma.certificate.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.CertificateUpdateInput) {
    return prisma.certificate.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.certificate.delete({
      where: { id },
    });
  }
}
