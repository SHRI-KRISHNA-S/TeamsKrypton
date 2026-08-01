import { NotificationRepository } from '../repositories/notification.repository';
import { Notification, NotificationType } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import { logger } from '../config/logger';

export class NotificationService {
  private notificationRepository = new NotificationRepository();

  async sendNotification(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    const notif = await this.notificationRepository.create(userId, title, message, type);

    // Simulate concurrent email triggers
    logger.info(`[Simulation Email] Recipient ID: ${userId} | Subject: ${title} | Message: ${message}`);

    return notif;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.fetchByUserId(userId);
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      return await this.notificationRepository.markAsRead(id);
    } catch (error) {
      throw new NotFoundError('Notification not found');
    }
  }
}
