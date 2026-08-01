import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { UnauthorizedError } from '../utils/errors';

const notificationService = new NotificationService();

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const notifications = await notificationService.getNotifications(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await notificationService.markAsRead(req.params.notificationId);
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read successfully',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};
