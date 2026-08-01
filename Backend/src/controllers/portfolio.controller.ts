import { Request, Response, NextFunction } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { UnauthorizedError } from '../utils/errors';

const portfolioService = new PortfolioService();

export const addProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const project = await portfolioService.addProject(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Project logged in portfolio successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const addAchievement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const achievement = await portfolioService.addAchievement(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Achievement logged in portfolio successfully',
      data: { achievement },
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const portfolio = await portfolioService.getPortfolio(req.params.userId);
    res.status(200).json({
      status: 'success',
      data: { portfolio },
    });
  } catch (error) {
    next(error);
  }
};

export const exportPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const portfolioString = await portfolioService.exportPortfolio(req.user.id);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.json');
    res.status(200).send(portfolioString);
  } catch (error) {
    next(error);
  }
};
