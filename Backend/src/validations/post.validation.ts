import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().max(100).optional(),
    content: z.string().min(1, 'Post content cannot be empty'),
    clubId: z.string().uuid('Invalid Club UUID').optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content cannot be empty'),
  }),
});
