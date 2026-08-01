import { Request, Response, NextFunction } from 'express';
import { certificateService } from '../services/certificate.service';
import { BadRequestError } from '../utils/errors';

export const uploadCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }
    if (!req.file) {
      throw new BadRequestError('Certificate file attachment is required.');
    }

    const { title, issuedBy, issueDate, category, description, skills, expiryDate, verificationUrl, certificateId } = req.body;

    const metadata = {
      title,
      issuedBy,
      issueDate,
      category,
      description,
      skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
      expiryDate,
      verificationUrl,
      certificateId,
    };

    const fileData = {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    const certificate = await certificateService.uploadCertificate(req.user.id, metadata, fileData);

    res.status(201).json({
      status: 'success',
      message: 'Certificate uploaded successfully',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    const certificates = await certificateService.getCertificates(req.user.id, req.user.role);

    res.status(200).json({
      status: 'success',
      data: { certificates },
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    const certificate = await certificateService.getCertificateById(req.params.id, req.user.id, req.user.role);

    res.status(200).json({
      status: 'success',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    const certificate = await certificateService.updateCertificate(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );

    res.status(200).json({
      status: 'success',
      message: 'Certificate updated successfully',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    await certificateService.deleteCertificate(req.params.id, req.user.id, req.user.role);

    res.status(200).json({
      status: 'success',
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const approveCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    const { remarks } = req.body;
    const certificate = await certificateService.approveCertificate(
      req.params.id,
      req.user.email,
      remarks
    );

    res.status(200).json({
      status: 'success',
      message: 'Certificate approved successfully',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User authentication context not found.');
    }

    const { remarks } = req.body;
    const certificate = await certificateService.rejectCertificate(
      req.params.id,
      req.user.email,
      remarks
    );

    res.status(200).json({
      status: 'success',
      message: 'Certificate rejected successfully',
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};
