import { z } from 'zod';
import { OpportunityType } from '@prisma/client';

export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    type: z.nativeEnum(OpportunityType),
    company: z.string().optional(),
    deadline: z.string().datetime('Invalid deadline date format'),
    location: z.string().optional(),
    requirements: z.string().optional(),
    link: z.string().url('Invalid opportunity link URL').optional(),
  }),
});

export const applyOpportunitySchema = z.object({
  body: z.object({
    resumeUrl: z.string().url('Resume must be a valid URL').optional(),
  }),
});
