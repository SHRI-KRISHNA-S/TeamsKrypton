import { z } from 'zod';
import { MembershipStatus, ClubRole } from '@prisma/client';

export const updateMembershipSchema = z.object({
  body: z.object({
    status: z.nativeEnum(MembershipStatus).optional(),
    role: z.nativeEnum(ClubRole).optional(),
  }),
});
