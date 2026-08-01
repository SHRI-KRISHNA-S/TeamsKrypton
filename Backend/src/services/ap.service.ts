import { ApRepository } from '../repositories/ap.repository';
import { POINTS_CONFIG, ActivityType } from '../config/points';
import { NotificationService } from './notification.service';
import { ActivityTransaction } from '@prisma/client';
import { BadRequestError } from '../utils/errors';

export class ApService {
  private apRepository = new ApRepository();
  private notificationService = new NotificationService();

  async recordActivity(
    userId: string,
    activityType: ActivityType,
    description: string,
    createdBy: string,
    referenceId?: string
  ): Promise<ActivityTransaction> {
    const points = POINTS_CONFIG[activityType];
    if (points === undefined) {
      throw new BadRequestError('Invalid activity type');
    }

    const transaction = await this.apRepository.createTransaction(
      userId,
      activityType,
      points,
      description,
      createdBy,
      referenceId
    );

    // Send notifications to the user
    await this.notificationService.sendNotification(
      userId,
      'Activity Points Earned!',
      `You earned ${points} AP for: ${description}`,
      'OPPORTUNITY_UPDATE'
    );

    return transaction;
  }

  async getTransactions(userId: string): Promise<ActivityTransaction[]> {
    return this.apRepository.getTransactionsByUserId(userId);
  }
}
