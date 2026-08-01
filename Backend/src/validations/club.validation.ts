import { z } from 'zod';

export const createClubSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Club name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'),
    logo: z.string().url('Logo must be a valid URL').optional(),
    banner: z.string().url('Banner must be a valid URL').optional(),
  }),
});

export const updateClubSchema = z.object({
  body: z.object({
    description: z.string().min(10).optional(),
    category: z.string().optional(),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
  }),
});

export const addGalleryItemSchema = z.object({
  body: z.object({
    url: z.string().url('Media item must be a valid URL'),
  }),
});
