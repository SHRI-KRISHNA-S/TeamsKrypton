import { z } from 'zod';
import { POINTS_CONFIG } from '../config/points';

export const recordActivitySchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User UUID'),
    activityType: z.string().refine(val => val in POINTS_CONFIG, {
      message: 'Invalid Activity Type key',
    }),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    referenceId: z.string().uuid('Invalid Reference ID').optional(),
  }),
});
