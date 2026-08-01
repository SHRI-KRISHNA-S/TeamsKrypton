import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { UnauthorizedError } from '../utils/errors';

const leaderboardService = new LeaderboardService();

export const getLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { department, clubId, search, page, limit } = req.query;
    
    const leaderboard = await leaderboardService.getLeaderboard(req.user.id, req.user.role, {
      department: department as string,
      clubId: clubId as string,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.status(200).json({
      status: 'success',
      data: { leaderboard },
    });
  } catch (error) {
    next(error);
  }
};
