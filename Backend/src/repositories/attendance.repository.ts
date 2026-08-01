import { prisma } from '../config/db';
import { Attendance, AttendanceMethod } from '@prisma/client';

export class AttendanceRepository {
  async mark(userId: string, eventId: string, method: AttendanceMethod, markedBy: string): Promise<Attendance> {
    // Mark the registration as attended
    await prisma.eventRegistration.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {
        attended: true,
      },
      create: {
        userId,
        eventId,
        status: 'REGISTERED',
        attended: true,
      },
    });

    // Write the attendance log entry
    return prisma.attendance.create({
      data: {
        userId,
        eventId,
        method,
        markedBy,
      },
    });
  }

  async getAttendanceRecord(userId: string, eventId: string): Promise<Attendance | null> {
    return prisma.attendance.findFirst({
      where: { userId, eventId },
    });
  }

  async getReport(eventId: string): Promise<any[]> {
    return prisma.attendance.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            department: true,
          },
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }
}
