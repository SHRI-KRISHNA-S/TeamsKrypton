import { Request, Response, NextFunction } from 'express';
import { MembershipService } from '../services/membership.service';
import { UnauthorizedError } from '../utils/errors';

const membershipService = new MembershipService();

export const joinClub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const membership = await membershipService.joinClub(req.user.id, req.params.clubId);
    res.status(201).json({
      status: 'success',
      message: 'Join request submitted successfully. Pending approval.',
      data: { membership },
    });
  } catch (error) {
    next(error);
  }
};

export const approveMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const membership = await membershipService.approveMembership(req.params.membershipId);
    res.status(200).json({
      status: 'success',
      message: 'Membership request approved successfully',
      data: { membership },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const membership = await membershipService.rejectMembership(req.params.membershipId);
    res.status(200).json({
      status: 'success',
      message: 'Membership request rejected successfully',
      data: { membership },
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await membershipService.removeMember(req.params.membershipId);
    res.status(200).json({
      status: 'success',
      message: 'Member removed successfully from club',
    });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const members = await membershipService.getMembers(req.params.clubId);
    res.status(200).json({
      status: 'success',
      data: { members },
    });
  } catch (error) {
    next(error);
  }
};
