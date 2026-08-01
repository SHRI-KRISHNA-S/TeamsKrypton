import { MembershipRepository } from '../repositories/membership.repository';
import { ClubRepository } from '../repositories/club.repository';
import { Membership, MembershipStatus, ClubRole } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

export class MembershipService {
  private membershipRepository = new MembershipRepository();
  private clubRepository = new ClubRepository();

  async joinClub(userId: string, clubId: string): Promise<Membership> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club not found');
    }

    const existing = await this.membershipRepository.findByUnion(userId, clubId);
    if (existing) {
      throw new ConflictError(`Membership application status: '${existing.status}'`);
    }

    return this.membershipRepository.create(userId, clubId);
  }

  async getMembership(id: string): Promise<Membership> {
    const membership = await this.membershipRepository.findById(id);
    if (!membership) {
      throw new NotFoundError('Membership record not found');
    }
    return membership;
  }

  async approveMembership(id: string): Promise<Membership> {
    await this.getMembership(id);
    return this.membershipRepository.update(id, { status: MembershipStatus.APPROVED });
  }

  async rejectMembership(id: string): Promise<Membership> {
    await this.getMembership(id);
    return this.membershipRepository.update(id, { status: MembershipStatus.REJECTED });
  }

  async removeMember(id: string): Promise<Membership> {
    await this.getMembership(id);
    return this.membershipRepository.delete(id);
  }

  async getMembers(clubId: string): Promise<any[]> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club not found');
    }
    return this.membershipRepository.getMembers(clubId);
  }

  async checkUserRole(userId: string, clubId: string): Promise<ClubRole | null> {
    return this.membershipRepository.checkUserRoleInClub(userId, clubId);
  }
}
