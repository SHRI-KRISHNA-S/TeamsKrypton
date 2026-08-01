import { z } from 'zod';

export const issueCertificateSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User UUID'),
    title: z.string().min(3, 'Certificate title must be at least 3 characters'),
    metadata: z.record(z.any()).optional(),
  }),
});

export const verifyCertificateSchema = z.object({
  body: z.object({
    uniqueId: z.string().min(1, 'Certificate Unique ID is required'),
  }),
});
