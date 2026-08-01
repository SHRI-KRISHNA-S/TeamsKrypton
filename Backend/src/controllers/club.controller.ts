import { Request, Response, NextFunction } from 'express';
import { ClubService } from '../services/club.service';
import { UnauthorizedError } from '../utils/errors';

const clubService = new ClubService();

export const getClubs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clubs = await clubService.getClubsList();
    res.status(200).json({
      status: 'success',
      data: { clubs },
    });
  } catch (error) {
    next(error);
  }
};

export const getClubById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const club = await clubService.getClub(req.params.clubId);
    res.status(200).json({
      status: 'success',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

export const createClub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, category, logo, banner } = req.body;
    const club = await clubService.createClub({ name, description, category, logo, banner });
    res.status(201).json({
      status: 'success',
      message: 'Club creation request submitted successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

export const updateClub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const club = await clubService.updateClub(req.params.clubId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Club details updated successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await clubService.deleteClub(req.params.clubId);
    res.status(200).json({
      status: 'success',
      message: 'Club deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const approveClub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const club = await clubService.approveClub(req.params.clubId);
    res.status(200).json({
      status: 'success',
      message: 'Club request approved successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

export const addGalleryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { url } = req.body;
    const media = await clubService.addGalleryItem(req.params.clubId, req.user.id, url);
    res.status(201).json({
      status: 'success',
      message: 'Media uploaded to club gallery successfully',
      data: { media },
    });
  } catch (error) {
    next(error);
  }
};

export const getGallery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gallery = await clubService.getGallery(req.params.clubId);
    res.status(200).json({
      status: 'success',
      data: { gallery },
    });
  } catch (error) {
    next(error);
  }
};
