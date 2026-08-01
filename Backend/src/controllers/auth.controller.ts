import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../utils/jwt';
import { 
  BadRequestError, 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError 
} from '../utils/errors';
import { logger } from '../config/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, department, role } = req.body;

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        department,
        role: role || 'STUDENT',
        verificationToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        createdAt: true,
      },
    });

    // Log simulated verification email link
    logger.info(`[Simulation Mail] Verification link for ${user.email}: http://localhost:5000/api/v1/auth/verify-email?token=${verificationToken}`);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please verify your email.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare passwords
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate Access token
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });

    // Handle concurrent duplicate logins gracefully (e.g. React StrictMode double rendering)
    const recentToken = await prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
        revoked: false,
        createdAt: {
          gte: new Date(Date.now() - 5000), // created in the last 5 seconds
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let refreshTokenString: string;
    let expiresAt: Date;

    if (recentToken) {
      refreshTokenString = recentToken.token;
      expiresAt = recentToken.expiresAt;
      logger.info(`Reusing recently generated refresh token for user ${user.id} due to concurrent requests`);
    } else {
      // Keep up to 4 previous active sessions, revoke any older ones to support multiple browser sessions
      const activeTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id, revoked: false },
        orderBy: { createdAt: 'desc' },
      });

      if (activeTokens.length >= 4) {
        const tokensToRevoke = activeTokens.slice(4);
        await prisma.refreshToken.updateMany({
          where: { id: { in: tokensToRevoke.map(t => t.id) } },
          data: { revoked: true },
        });
        logger.info(`Revoked ${tokensToRevoke.length} old refresh tokens for user ${user.id} to maintain safety limits`);
      }

      refreshTokenString = generateRefreshToken(user.id);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      try {
        await prisma.refreshToken.create({
          data: {
            token: refreshTokenString,
            userId: user.id,
            expiresAt,
          },
        });
        logger.info(`Successfully created new refresh token for user ${user.id}`);
      } catch (dbError: any) {
        // Safe fallback in case of database transaction race conditions
        if (dbError.code === 'P2002') {
          const duplicateToken = await prisma.refreshToken.findFirst({
            where: { userId: user.id, revoked: false },
            orderBy: { createdAt: 'desc' },
          });
          if (duplicateToken) {
            refreshTokenString = duplicateToken.token;
            expiresAt = duplicateToken.expiresAt;
            logger.warn(`Recovered from database unique constraint race condition for user ${user.id}`);
          } else {
            throw dbError;
          }
        } else {
          throw dbError;
        }
      }
    }

    // Set HTTP-only Cookie for Refresh Token
    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshTokenString = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshTokenString) {
      throw new BadRequestError('Refresh token is required');
    }

    // Verify token structure
    const decoded = verifyRefreshToken(refreshTokenString);

    // Check database to see if token is valid and not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenString },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Token Rotation: Revoke current refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Generate new tokens
    const newAccessToken = generateAccessToken({ 
      id: storedToken.user.id, 
      email: storedToken.user.email, 
      role: storedToken.user.role 
    });
    let newRefreshTokenString = generateRefreshToken(storedToken.user.id);

    // Save new Refresh token
    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
      await prisma.refreshToken.create({
        data: {
          token: newRefreshTokenString,
          userId: storedToken.user.id,
          expiresAt,
        },
      });
      logger.info(`Successfully created rotated refresh token for user ${storedToken.user.id}`);
    } catch (dbError: any) {
      if (dbError.code === 'P2002') {
        const duplicateToken = await prisma.refreshToken.findFirst({
          where: { userId: storedToken.user.id, revoked: false },
          orderBy: { createdAt: 'desc' },
        });
        if (duplicateToken) {
          newRefreshTokenString = duplicateToken.token;
          expiresAt = duplicateToken.expiresAt;
          logger.warn(`Recovered from refresh unique constraint race condition for user ${storedToken.user.id}`);
        } else {
          throw dbError;
        }
      } else {
        throw dbError;
      }
    }

    // Set cookie
    res.cookie('refreshToken', newRefreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
    });

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshTokenString = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshTokenString) {
      // Invalidate in DB
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenString },
        data: { revoked: true },
      });
    }

    // Clear Cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.query.token as string || req.body.token;

    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundError('Invalid verification token');
    }

    // Update user verified status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('User with this email does not exist');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expires,
      },
    });

    // Log simulation link
    logger.info(`[Simulation Mail] Password Reset link for ${user.email}: http://localhost:5000/api/v1/auth/reset-password?token=${resetToken}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link generated and logged.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
