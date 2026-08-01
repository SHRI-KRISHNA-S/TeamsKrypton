import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    skills: z.array(z.string()).optional(),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
    avatar: z.string().url('Avatar must be a valid URL').optional(),
  }),
});

export const searchUsersSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    department: z.string().optional(),
    skill: z.string().optional(),
  }),
});
