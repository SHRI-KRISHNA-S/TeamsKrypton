import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;
  let errors: any = undefined;

  // Handle Custom AppErrors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle Prisma Database Errors
  if (err.name?.startsWith('PrismaClient') || err.message?.includes('prisma')) {
    statusCode = 400;
    message = 'Database operation failed';
    isOperational = true;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    isOperational = true;
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
    isOperational = true;
  }

  // Log non-operational errors as errors, operational ones as warnings
  if (!isOperational) {
    logger.error(`[Unhandled Error] Path: ${req.path} -- Message: ${err.message} -- Stack: ${err.stack}`);
  } else {
    logger.warn(`[Operational Error] Path: ${req.path} -- Code: ${statusCode} -- Message: ${message}`);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
