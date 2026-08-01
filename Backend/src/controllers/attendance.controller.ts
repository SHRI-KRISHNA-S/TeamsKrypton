import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { UnauthorizedError } from '../utils/errors';

const attendanceService = new AttendanceService();

export const markQrAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { qrToken } = req.body;
    const attendance = await attendanceService.markQrAttendance(req.user.id, qrToken);
    res.status(201).json({
      status: 'success',
      message: 'QR Attendance marked successfully',
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

export const markManualAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { userId, method } = req.body;
    const attendance = await attendanceService.markManualAttendance(userId, req.params.eventId, method, req.user.id);
    res.status(201).json({
      status: 'success',
      message: 'Attendance marked manually successfully',
      data: { attendance },
    });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await attendanceService.getReport(req.params.eventId);
    res.status(200).json({
      status: 'success',
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};
