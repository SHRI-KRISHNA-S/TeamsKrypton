import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UnauthorizedError } from '../utils/errors';

const userService = new UserService();

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { skills, bio, avatar } = req.body;
    const user = await userService.updateProfile(req.user.id, { skills, bio, avatar });
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, department, skill } = req.query;
    const users = await userService.searchUsers({
      q: q as string,
      department: department as string,
      skill: skill as string,
    });
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
