import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/db';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedError('User associated with this token no longer exists');
    }

    // Attach to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireOwnership = (
  paramName: string,
  checkFn?: (userId: string, resourceId: string) => Promise<boolean>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const resourceId = req.params[paramName];
      const userId = req.user.id;
      const userRole = req.user.role;

      // Super Admins bypass ownership
      if (userRole === Role.SUPER_ADMIN) {
        return next();
      }

      // Check simple identity matching if no custom check logic is passed
      if (!checkFn) {
        if (userId !== resourceId) {
          throw new ForbiddenError('Access denied: You do not own this resource');
        }
        return next();
      }

      // Run custom query check
      const isOwner = await checkFn(userId, resourceId);
      if (!isOwner) {
        throw new ForbiddenError('Access denied: You do not own this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
