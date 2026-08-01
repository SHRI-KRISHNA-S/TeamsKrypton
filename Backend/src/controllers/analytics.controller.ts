import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export const getDashboardAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const analytics = await analyticsService.getDashboardAnalytics();
    res.status(200).json({
      status: 'success',
      data: { analytics },
    });
  } catch (error) {
    next(error);
  }
};
