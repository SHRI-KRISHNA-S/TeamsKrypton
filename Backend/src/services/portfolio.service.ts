import { PortfolioRepository } from '../repositories/portfolio.repository';
import { getStudentLevel } from '../config/points';
import { Project, Achievement } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import { prisma } from '../config/db';

export class PortfolioService {
  private portfolioRepository = new PortfolioRepository();

  async addProject(userId: string, data: { title: string; description: string; link?: string }): Promise<Project> {
    return this.portfolioRepository.addProject(userId, data);
  }

  async addAchievement(userId: string, data: { title: string; description: string; date: string }): Promise<Achievement> {
    return this.portfolioRepository.addAchievement(userId, {
      ...data,
      date: new Date(data.date),
    });
  }

  async getPortfolio(userId: string): Promise<any> {
    const userContext = await this.portfolioRepository.getPortfolioContext(userId);
    if (!userContext) {
      throw new NotFoundError('Student profile not found');
    }

    const overallRankUsers = await prisma.user.findMany({
      orderBy: { totalAp: 'desc' },
      select: { id: true },
    });
    const overallRank = overallRankUsers.findIndex(u => u.id === userId) + 1;

    const level = getStudentLevel(userContext.totalAp);

    const volunteerTransactions = userContext.activityTransactions.filter(
      (tx: any) => tx.activityType === 'VOLUNTEER_ACTIVITY'
    );
    const volunteerHours = volunteerTransactions.length * 4; // Assume 4 hours per task

    return {
      studentProfile: {
        id: userContext.id,
        name: userContext.name,
        email: userContext.email,
        department: userContext.department,
        avatar: userContext.avatar,
        bio: userContext.bio,
      },
      skills: userContext.skills,
      achievements: userContext.achievements.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        date: a.date,
      })),
      certificates: userContext.certificates,
      volunteerHours,
      projects: userContext.projects,
      clubMembershipHistory: userContext.memberships.map((m: any) => ({
        clubName: m.club.name,
        clubLogo: m.club.logo,
        role: m.role,
        joinedAt: m.createdAt,
      })),
      activityPoints: userContext.totalAp,
      level,
      overallRank,
      activityTimeline: userContext.activityTransactions.map((tx: any) => ({
        activityType: tx.activityType,
        points: tx.points,
        description: tx.description,
        timestamp: tx.createdAt,
      })),
      recentEvents: userContext.registrations.map((r: any) => ({
        eventTitle: r.event.title,
        eventDate: r.event.date,
      })),
    };
  }

  async exportPortfolio(userId: string): Promise<string> {
    const portfolio = await this.getPortfolio(userId);
    return JSON.stringify(portfolio, null, 2);
  }
}
