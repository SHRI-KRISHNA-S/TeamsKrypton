import { prisma } from '../config/db';
import { Membership, MembershipStatus, ClubRole } from '@prisma/client';

export class MembershipRepository {
  async findById(id: string): Promise<Membership | null> {
    return prisma.membership.findUnique({ where: { id }, include: { club: true } });
  }

  async findByUnion(userId: string, clubId: string): Promise<Membership | null> {
    return prisma.membership.findUnique({
      where: {
        userId_clubId: { userId, clubId },
      },
    });
  }

  async create(userId: string, clubId: string): Promise<Membership> {
    return prisma.membership.create({
      data: {
        userId,
        clubId,
        status: MembershipStatus.PENDING,
        role: ClubRole.MEMBER,
      },
    });
  }

  async update(id: string, data: { status?: MembershipStatus; role?: ClubRole }): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Membership> {
    return prisma.membership.delete({ where: { id } });
  }

  async getMembers(clubId: string): Promise<any[]> {
    return prisma.membership.findMany({
      where: { clubId, status: MembershipStatus.APPROVED },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            department: true,
            avatar: true,
          },
        },
      },
    });
  }

  async checkUserRoleInClub(userId: string, clubId: string): Promise<ClubRole | null> {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_clubId: { userId, clubId },
      },
    });
    if (!membership || membership.status !== MembershipStatus.APPROVED) return null;
    return membership.role;
  }
}
