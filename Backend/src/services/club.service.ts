import { ClubRepository } from '../repositories/club.repository';
import { Club, GalleryItem } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

export class ClubService {
  private clubRepository = new ClubRepository();

  async getClub(id: string): Promise<Club> {
    const club = await this.clubRepository.findById(id);
    if (!club) {
      throw new NotFoundError('Club not found');
    }
    return club;
  }

  async getClubsList(): Promise<Club[]> {
    return this.clubRepository.findAllApproved();
  }

  async createClub(data: { name: string; description: string; category: string; logo?: string; banner?: string }): Promise<Club> {
    const existing = await this.clubRepository.findByName(data.name);
    if (existing) {
      throw new ConflictError('A club with this name already exists');
    }
    return this.clubRepository.create(data);
  }

  async updateClub(id: string, data: Partial<Club>): Promise<Club> {
    await this.getClub(id);
    return this.clubRepository.update(id, data);
  }

  async deleteClub(id: string): Promise<Club> {
    await this.getClub(id);
    return this.clubRepository.delete(id);
  }

  async approveClub(id: string): Promise<Club> {
    await this.getClub(id);
    return this.clubRepository.approve(id);
  }

  async addGalleryItem(clubId: string, userId: string, url: string): Promise<GalleryItem> {
    await this.getClub(clubId);
    return this.clubRepository.addGalleryItem(clubId, userId, url);
  }

  async getGallery(clubId: string): Promise<GalleryItem[]> {
    await this.getClub(clubId);
    return this.clubRepository.getGallery(clubId);
  }
}
