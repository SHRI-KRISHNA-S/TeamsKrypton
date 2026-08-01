import { Request, Response, NextFunction } from 'express';
import { CertificateService } from '../services/certificate.service';
import { UnauthorizedError } from '../utils/errors';

const certificateService = new CertificateService();

export const issueCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { userId, title, metadata } = req.body;
    const certificate = await certificateService.issueCertificate(userId, title, req.user.id, metadata);
    res.status(201).json({
      status: 'success',
      message: 'Certificate issued successfully',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { uniqueId } = req.params;
    const verification = await certificateService.verifyCertificate(uniqueId);
    res.status(200).json({
      status: 'success',
      data: { verification },
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const history = await certificateService.getHistory(req.params.userId);
    res.status(200).json({
      status: 'success',
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};
