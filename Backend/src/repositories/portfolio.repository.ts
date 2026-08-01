import { prisma } from '../config/db';
import { Project, Achievement } from '@prisma/client';

export class PortfolioRepository {
  async addProject(userId: string, data: { title: string; description: string; link?: string }): Promise<Project> {
    return prisma.project.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async addAchievement(userId: string, data: { title: string; description: string; date: Date }): Promise<Achievement> {
    return prisma.achievement.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getPortfolioContext(userId: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        achievements: true,
        certificates: true,
        memberships: {
          where: { status: 'APPROVED' },
          include: { club: { select: { name: true, logo: true } } },
        },
        registrations: {
          where: { attended: true },
          include: { event: { select: { title: true, date: true } } },
        },
        activityTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
