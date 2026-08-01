import { AdminRepository } from '../repositories/admin.repository';
import { prisma } from '../config/db';
import { AuditLog, GlobalSetting } from '@prisma/client';

export class AdminService {
  private adminRepository = new AdminRepository();

  async getDashboardStatistics(): Promise<any> {
    const pendingClubs = await prisma.club.findMany({
      where: { isApproved: false },
      select: { id: true, name: true, category: true, createdAt: true },
    });

    const pendingEvents = await prisma.event.findMany({
      where: { isApproved: false },
      include: { club: { select: { name: true } } },
    });

    const recentActivities = await prisma.activityTransaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, department: true } } },
    });

    const recentRegistrations = await prisma.eventRegistration.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
      },
    });

    return {
      pendingClubs,
      pendingEvents,
      recentActivities,
      recentRegistrations,
    };
  }

  async getAuditLogs(page?: number, limit?: number): Promise<AuditLog[]> {
    const p = page || 1;
    const l = limit || 50;
    return this.adminRepository.getAuditLogs((p - 1) * l, l);
  }

  async logAuditEvent(userId: string | null, action: string, details?: string, ipAddress?: string): Promise<AuditLog> {
    return this.adminRepository.logAudit(userId, action, details, ipAddress);
  }

  async updateSetting(key: string, value: string): Promise<GlobalSetting> {
    return this.adminRepository.setGlobalSetting(key, value);
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.adminRepository.getGlobalSetting(key);
    return setting ? setting.value : null;
  }

  async getSuperAdminPlatformStats(): Promise<any> {
    return this.adminRepository.getPlatformStats();
  }
}
