import { prisma } from '../config/db';
import { Event, EventRegistration, RegistrationStatus, Feedback, GalleryItem } from '@prisma/client';

export class EventRepository {
  async findById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id }, include: { club: true } });
  }

  async findAll(): Promise<Event[]> {
    return prisma.event.findMany({
      include: { club: { select: { name: true } } },
    });
  }

  async create(data: { title: string; description: string; date: Date; venue: string; capacity: number; clubId: string }): Promise<Event> {
    return prisma.event.create({
      data: {
        ...data,
        isApproved: false, // Must be approved by Faculty/Admin
      },
    });
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Event> {
    return prisma.event.delete({ where: { id } });
  }

  async approve(id: string): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async registerUser(userId: string, eventId: string): Promise<EventRegistration> {
    return prisma.eventRegistration.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {
        status: RegistrationStatus.REGISTERED,
      },
      create: {
        userId,
        eventId,
        status: RegistrationStatus.REGISTERED,
      },
    });
  }

  async getRegistration(userId: string, eventId: string): Promise<EventRegistration | null> {
    return prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
  }

  async countRegistrations(eventId: string): Promise<number> {
    return prisma.eventRegistration.count({
      where: { eventId, status: RegistrationStatus.REGISTERED },
    });
  }

  async addFeedback(userId: string, eventId: string, rating: number, comments?: string): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        userId,
        eventId,
        rating,
        comments,
      },
    });
  }

  async getFeedbacks(eventId: string): Promise<Feedback[]> {
    return prisma.feedback.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addGalleryItem(eventId: string, userId: string, url: string): Promise<GalleryItem> {
    return prisma.galleryItem.create({
      data: {
        url,
        eventId,
        userId,
      },
    });
  }

  async getGallery(eventId: string): Promise<GalleryItem[]> {
    return prisma.galleryItem.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
