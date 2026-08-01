import { z } from 'zod';
import { AttendanceMethod } from '@prisma/client';

export const markQrAttendanceSchema = z.object({
  body: z.object({
    qrToken: z.string().min(1, 'QR Token is required'),
  }),
});

export const markManualAttendanceSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User UUID'),
    method: z.nativeEnum(AttendanceMethod).default(AttendanceMethod.MANUAL),
  }),
});
