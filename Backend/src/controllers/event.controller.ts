import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { UnauthorizedError } from '../utils/errors';

const eventService = new EventService();

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await eventService.getEvent(req.params.eventId);
    res.status(200).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await eventService.getEventsList();
    res.status(200).json({
      status: 'success',
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, date, venue, capacity, clubId } = req.body;
    const event = await eventService.createEvent({ title, description, date, venue, capacity, clubId });
    res.status(201).json({
      status: 'success',
      message: 'Event creation request submitted successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await eventService.updateEvent(req.params.eventId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await eventService.deleteEvent(req.params.eventId);
    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const approveEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await eventService.approveEvent(req.params.eventId);
    res.status(200).json({
      status: 'success',
      message: 'Event approved successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const registration = await eventService.registerUser(req.user.id, req.params.eventId);
    res.status(201).json({
      status: 'success',
      message: 'Registered for event successfully',
      data: { registration },
    });
  } catch (error) {
    next(error);
  }
};

export const addFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { rating, comments } = req.body;
    const feedback = await eventService.addFeedback(req.user.id, req.params.eventId, rating, comments);
    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const feedbacks = await eventService.getFeedbacks(req.params.eventId);
    res.status(200).json({
      status: 'success',
      data: { feedbacks },
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
    const media = await eventService.addGalleryItem(req.params.eventId, req.user.id, url);
    res.status(201).json({
      status: 'success',
      message: 'Event photo added to gallery successfully',
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
    const gallery = await eventService.getGallery(req.params.eventId);
    res.status(200).json({
      status: 'success',
      data: { gallery },
    });
  } catch (error) {
    next(error);
  }
};
