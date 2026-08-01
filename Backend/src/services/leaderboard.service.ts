import { ApRepository } from '../repositories/ap.repository';
import { getStudentLevel } from '../config/points';
import { prisma } from '../config/db';
import { Role } from '@prisma/client';
import { ForbiddenError } from '../utils/errors';

export class LeaderboardService {
  private apRepository = new ApRepository();

  async getLeaderboard(
    userId: string,
    userRole: Role,
    filters: {
      department?: string;
      clubId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<any> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    // Enforce club filter viewing constraints
    if (filters.clubId) {
      if (userRole !== Role.SUPER_ADMIN && userRole !== Role.COLLEGE_ADMIN && userRole !== Role.FACULTY_COORDINATOR) {
        const membership = await prisma.membership.findUnique({
          where: {
            userId_clubId: { userId, clubId: filters.clubId },
          },
        });
        if (!membership || membership.status !== 'APPROVED') {
          throw new ForbiddenError('Access Denied: You do not belong to this club');
        }
      }
    }

    const rawLeaderboard = await this.apRepository.getLeaderboard({
      department: filters.department,
      clubId: filters.clubId,
      search: filters.search,
      skip,
      limit,
    });

    const rankedUsers = rawLeaderboard.map((user, index) => {
      const level = getStudentLevel(user.totalAp);
      const recentActivity = user.activityTransactions?.[0]
        ? `${user.activityTransactions[0].activityType} (+${user.activityTransactions[0].points})`
        : 'No recent activity';

      return {
        rank: skip + index + 1,
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        avatar: user.avatar,
        activityPoints: user.totalAp,
        level,
        achievements: user.achievements.map((a: any) => a.title),
        recentActivity,
      };
    });

    return rankedUsers;
  }
}
