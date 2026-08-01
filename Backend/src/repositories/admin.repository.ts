import { prisma } from '../config/db';
import { AuditLog, GlobalSetting } from '@prisma/client';

export class AdminRepository {
  async logAudit(userId: string | null, action: string, details?: string, ipAddress?: string): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  }

  async getAuditLogs(skip: number, limit: number): Promise<any[]> {
    return prisma.auditLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async setGlobalSetting(key: string, value: string): Promise<GlobalSetting> {
    return prisma.globalSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getGlobalSetting(key: string): Promise<GlobalSetting | null> {
    return prisma.globalSetting.findUnique({ where: { key } });
  }

  async getPlatformStats(): Promise<any> {
    const userCount = await prisma.user.count();
    const clubCount = await prisma.club.count();
    const eventCount = await prisma.event.count();
    const transactionCount = await prisma.activityTransaction.count();

    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    return {
      userCount,
      clubCount,
      eventCount,
      transactionCount,
      roleStats,
    };
  }
}
