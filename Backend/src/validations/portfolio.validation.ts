import { z } from 'zod';

export const addProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Project title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    link: z.string().url('Invalid project link URL').optional().nullable(),
  }),
});

export const addAchievementSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Achievement title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().datetime('Invalid ISO date string'),
  }),
});
