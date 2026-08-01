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

    // Generate Access & Refresh tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshTokenString = generateRefreshToken(user.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.ip || null;
    const deviceId = req.body.deviceId || (req.headers['x-device-id'] as string) || null;

    // Persist refresh token and audit logging inside a transaction
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.create({
        data: {
          token: refreshTokenString,
          userId: user.id,
          expiresAt,
          deviceId,
          userAgent,
          ipAddress,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          details: `Successful login session initialized. Device ID: ${deviceId || 'N/A'}. User-Agent: ${userAgent || 'N/A'}.`,
          ipAddress,
        },
      });

      // Sweep/clean expired/revoked refresh tokens to prevent table size bloat
      await tx.refreshToken.deleteMany({
        where: {
          userId: user.id,
          OR: [
            { expiresAt: { lt: new Date() } },
            { revoked: true }
          ]
        }
      });
    });

    logger.info(`Session created and tokens generated successfully for user: ${user.id}`);

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

    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.ip || null;
    const deviceId = req.body.deviceId || (req.headers['x-device-id'] as string) || null;

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      await prisma.auditLog.create({
        data: {
          userId: storedToken ? storedToken.userId : null,
          action: 'TOKEN_REFRESH_FAILED',
          details: `Attempted token refresh failed. Token details: ID: ${storedToken?.id || 'N/A'}. Expired: ${storedToken ? storedToken.expiresAt < new Date() : 'N/A'}.`,
          ipAddress,
        },
      });
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ 
      id: storedToken.user.id, 
      email: storedToken.user.email, 
      role: storedToken.user.role 
    });
    const newRefreshTokenString = generateRefreshToken(storedToken.user.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Refresh Token Rotation inside a single transaction
    await prisma.$transaction(async (tx) => {
      // Revoke only the token being refreshed
      await tx.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      // Save new Refresh token inheriting previous session info if new info is not provided
      await tx.refreshToken.create({
        data: {
          token: newRefreshTokenString,
          userId: storedToken.user.id,
          expiresAt,
          deviceId: deviceId || storedToken.deviceId,
          userAgent: userAgent || storedToken.userAgent,
          ipAddress: ipAddress || storedToken.ipAddress,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: storedToken.user.id,
          action: 'TOKEN_REFRESH',
          details: `Refresh token rotated successfully. Old token ID: ${storedToken.id} revoked.`,
          ipAddress,
        },
      });

      // Clean expired refresh tokens for this user
      await tx.refreshToken.deleteMany({
        where: {
          userId: storedToken.user.id,
          expiresAt: { lt: new Date() },
        },
      });
    });

    logger.info(`Refresh token rotated successfully for user ${storedToken.user.id}`);

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
    const ipAddress = req.ip || null;

    if (refreshTokenString) {
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshTokenString },
      });

      if (storedToken) {
        await prisma.$transaction(async (tx) => {
          await tx.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
          });

          await tx.auditLog.create({
            data: {
              userId: storedToken.userId,
              action: 'USER_LOGOUT',
              details: `User logged out session successfully. Revoked Token ID: ${storedToken.id}.`,
              ipAddress,
            },
          });
        });
        logger.info(`User ${storedToken.userId} logged out successfully`);
      }
    }

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
