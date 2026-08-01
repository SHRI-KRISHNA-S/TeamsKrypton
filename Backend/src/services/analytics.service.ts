import { prisma } from '../config/db';

export class AnalyticsService {
  async getDashboardAnalytics(): Promise<any> {
    // 1. Most Active Students
    const topStudents = await prisma.user.findMany({
      orderBy: { totalAp: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, totalAp: true, department: true },
    });

    // 2. Most Active Departments
    const departmentAp = await prisma.user.groupBy({
      by: ['department'],
      _sum: {
        totalAp: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          totalAp: 'desc',
        },
      },
      take: 5,
    });

    // 3. Most Active Clubs
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { memberships: true, events: true },
        },
      },
      take: 5,
    });
    
    const topClubs = clubs.map(club => ({
      id: club.id,
      name: club.name,
      members: club._count.memberships,
      events: club._count.events,
      activityScore: club._count.memberships * 2 + club._count.events * 10,
    })).sort((a, b) => b.activityScore - a.activityScore);

    // 4. Attendance Stats
    const totalRegistrations = await prisma.eventRegistration.count();
    const totalAttended = await prisma.eventRegistration.count({ where: { attended: true } });

    // 5. Events Stats
    const totalEvents = await prisma.event.count();
    const approvedEvents = await prisma.event.count({ where: { isApproved: true } });

    return {
      topStudents,
      topDepartments: departmentAp.map(d => ({
        department: d.department,
        totalPoints: d._sum.totalAp || 0,
        studentCount: d._count,
      })),
      topClubs,
      attendanceStats: {
        totalRegistrations,
        totalAttended,
        attendanceRate: totalRegistrations > 0 ? (totalAttended / totalRegistrations) * 100 : 0,
      },
      eventsSummary: {
        totalEvents,
        approvedEvents,
        pendingApproval: totalEvents - approvedEvents,
      },
    };
  }
}
