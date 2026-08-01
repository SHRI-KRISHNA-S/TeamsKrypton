import { prisma } from '../config/db';
import { ActivityTransaction } from '@prisma/client';

export class ApRepository {
  async createTransaction(userId: string, activityType: string, points: number, description: string, createdBy: string, referenceId?: string): Promise<ActivityTransaction> {
    return prisma.$transaction(async (tx) => {
      // Write transaction record
      const transaction = await tx.activityTransaction.create({
        data: {
          userId,
          activityType,
          points,
          description,
          referenceId,
          createdBy,
        },
      });

      // Atomically update user total AP score
      await tx.user.update({
        where: { id: userId },
        data: {
          totalAp: {
            increment: points,
          },
        },
      });

      return transaction;
    });
  }

  async getTransactionsByUserId(userId: string): Promise<ActivityTransaction[]> {
    return prisma.activityTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLeaderboard(filters: {
    department?: string;
    clubId?: string;
    search?: string;
    skip: number;
    limit: number;
  }): Promise<any[]> {
    const { department, clubId, search, skip, limit } = filters;

    return prisma.user.findMany({
      where: {
        AND: [
          department ? { department: { equals: department, mode: 'insensitive' } } : {},
          clubId
            ? {
                memberships: {
                  some: {
                    clubId,
                    status: 'APPROVED',
                  },
                },
              }
            : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatar: true,
        totalAp: true,
        achievements: { select: { title: true }, take: 2 },
        certificates: { where: { status: 'APPROVED' }, select: { title: true }, take: 3 },
        activityTransactions: { select: { activityType: true, points: true, createdAt: true }, take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: {
        totalAp: 'desc',
      },
      skip,
      take: limit,
    });
  }
}
