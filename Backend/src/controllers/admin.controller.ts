import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { UnauthorizedError } from '../utils/errors';

const adminService = new AdminService();

export const getDashboardStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStatistics();
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const logs = await adminService.getAuditLogs(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    res.status(200).json({
      status: 'success',
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
};

export const updateGlobalSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key, value } = req.body;
    const setting = await adminService.updateSetting(key, value);
    
    if (req.user) {
      await adminService.logAuditEvent(req.user.id, 'UPDATE_SETTING', `Updated setting ${key} to ${value}`, req.ip);
    }

    res.status(200).json({
      status: 'success',
      message: 'Global setting updated successfully',
      data: { setting },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const platform = await adminService.getSuperAdminPlatformStats();
    res.status(200).json({
      status: 'success',
      data: { platform },
    });
  } catch (error) {
    next(error);
  }
};
