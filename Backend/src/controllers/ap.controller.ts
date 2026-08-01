import { Request, Response, NextFunction } from 'express';
import { ApService } from '../services/ap.service';
import { UnauthorizedError } from '../utils/errors';

const apService = new ApService();

export const recordActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { userId, activityType, description, referenceId } = req.body;
    const transaction = await apService.recordActivity(userId, activityType, description, req.user.id, referenceId);
    res.status(201).json({
      status: 'success',
      message: 'Activity points transaction recorded successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transactions = await apService.getTransactions(req.params.userId);
    res.status(200).json({
      status: 'success',
      data: { transactions },
    });
  } catch (error) {
    next(error);
  }
};
