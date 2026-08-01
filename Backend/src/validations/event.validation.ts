import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().datetime('Invalid ISO datetime string'),
    venue: z.string().min(1, 'Venue is required'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    clubId: z.string().uuid('Invalid Club UUID'),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    date: z.string().datetime().optional(),
    venue: z.string().optional(),
    capacity: z.number().int().positive().optional(),
  }),
});

export const addFeedbackSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comments: z.string().max(300).optional(),
  }),
});

export const addEventGalleryItemSchema = z.object({
  body: z.object({
    url: z.string().url('Media item must be a valid URL'),
  }),
});
