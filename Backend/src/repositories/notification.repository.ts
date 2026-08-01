import { prisma } from '../config/db';
import { Notification, NotificationType } from '@prisma/client';

export class NotificationRepository {
  async create(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async fetchByUserId(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
