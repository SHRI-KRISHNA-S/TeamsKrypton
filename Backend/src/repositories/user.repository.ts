import { prisma } from '../config/db';
import { User } from '@prisma/client';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(
    id: string,
    data: { skills?: string[]; bio?: string; avatar?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async searchUsers(query: { q?: string; department?: string; skill?: string }): Promise<User[]> {
    const { q, department, skill } = query;

    return prisma.user.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: 'insensitive' } },
                  { email: { contains: q, mode: 'insensitive' } },
                ],
              }
            : {},
          department ? { department: { equals: department, mode: 'insensitive' } } : {},
          skill ? { skills: { has: skill } } : {},
        ],
      },
    });
  }
}
