import { EventRepository } from '../repositories/event.repository';
import { ClubRepository } from '../repositories/club.repository';
import { Event, EventRegistration, RegistrationStatus, Feedback, GalleryItem } from '@prisma/client';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors';

export class EventService {
  private eventRepository = new EventRepository();
  private clubRepository = new ClubRepository();

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return event;
  }

  async getEventsList(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async createEvent(data: { title: string; description: string; date: string; venue: string; capacity: number; clubId: string }): Promise<Event> {
    const club = await this.clubRepository.findById(data.clubId);
    if (!club) {
      throw new NotFoundError('Club not found');
    }

    return this.eventRepository.create({
      ...data,
      date: new Date(data.date),
    });
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    await this.getEvent(id);
    return this.eventRepository.update(id, data);
  }

  async deleteEvent(id: string): Promise<Event> {
    await this.getEvent(id);
    return this.eventRepository.delete(id);
  }

  async approveEvent(id: string): Promise<Event> {
    await this.getEvent(id);
    return this.eventRepository.approve(id);
  }

  async registerUser(userId: string, eventId: string): Promise<EventRegistration> {
    const event = await this.getEvent(eventId);
    if (!event.isApproved) {
      throw new BadRequestError('Cannot register for an unapproved event');
    }

    // Capacity checking
    const registeredCount = await this.eventRepository.countRegistrations(eventId);
    if (registeredCount >= event.capacity) {
      throw new BadRequestError('Event capacity limit reached');
    }

    // Check active registration status
    const existing = await this.eventRepository.getRegistration(userId, eventId);
    if (existing && existing.status === RegistrationStatus.REGISTERED) {
      throw new ConflictError('You are already registered for this event');
    }

    return this.eventRepository.registerUser(userId, eventId);
  }

  async addFeedback(userId: string, eventId: string, rating: number, comments?: string): Promise<Feedback> {
    await this.getEvent(eventId);

    const registration = await this.eventRepository.getRegistration(userId, eventId);
    if (!registration || registration.status !== RegistrationStatus.REGISTERED) {
      throw new BadRequestError('You must register for this event to leave feedback.');
    }

    return this.eventRepository.addFeedback(userId, eventId, rating, comments);
  }

  async getFeedbacks(eventId: string): Promise<Feedback[]> {
    await this.getEvent(eventId);
    return this.eventRepository.getFeedbacks(eventId);
  }

  async addGalleryItem(eventId: string, userId: string, url: string): Promise<GalleryItem> {
    await this.getEvent(eventId);
    return this.eventRepository.addGalleryItem(eventId, userId, url);
  }

  async getGallery(eventId: string): Promise<GalleryItem[]> {
    await this.getEvent(eventId);
    return this.eventRepository.getGallery(eventId);
  }
}
