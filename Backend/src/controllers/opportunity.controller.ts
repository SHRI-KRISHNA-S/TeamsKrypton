import { Request, Response, NextFunction } from 'express';
import { OpportunityService } from '../services/opportunity.service';
import { UnauthorizedError } from '../utils/errors';

const opportunityService = new OpportunityService();

export const createOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const opp = await opportunityService.createOpportunity(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Opportunity listing created successfully',
      data: { opportunity: opp },
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query;
    const opportunities = await opportunityService.getOpportunities(type as any);
    res.status(200).json({
      status: 'success',
      data: { opportunities },
    });
  } catch (error) {
    next(error);
  }
};

export const applyOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { resumeUrl } = req.body;
    const application = await opportunityService.apply(req.params.oppId, req.user.id, resumeUrl);
    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applications = await opportunityService.getApplications(req.params.oppId);
    res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
};
