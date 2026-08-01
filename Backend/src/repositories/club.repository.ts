import { prisma } from '../config/db';
import { Club, GalleryItem } from '@prisma/client';

export class ClubRepository {
  async findById(id: string): Promise<Club | null> {
    return prisma.club.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Club | null> {
    return prisma.club.findUnique({ where: { name } });
  }

  async findAllApproved(): Promise<Club[]> {
    return prisma.club.findMany({ where: { isApproved: true } });
  }

  async create(data: { name: string; description: string; category: string; logo?: string; banner?: string }): Promise<Club> {
    return prisma.club.create({
      data: {
        ...data,
        isApproved: false, // Must be approved by Admin
      },
    });
  }

  async update(id: string, data: Partial<Club>): Promise<Club> {
    return prisma.club.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Club> {
    return prisma.club.delete({ where: { id } });
  }

  async approve(id: string): Promise<Club> {
    return prisma.club.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async addGalleryItem(clubId: string, userId: string, url: string): Promise<GalleryItem> {
    return prisma.galleryItem.create({
      data: {
        url,
        clubId,
        userId,
      },
    });
  }

  async getGallery(clubId: string): Promise<GalleryItem[]> {
    return prisma.galleryItem.findMany({
      where: { clubId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
