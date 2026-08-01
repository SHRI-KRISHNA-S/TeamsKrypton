import { AttendanceRepository } from '../repositories/attendance.repository';
import { EventRepository } from '../repositories/event.repository';
import { Attendance, AttendanceMethod } from '@prisma/client';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors';

export class AttendanceService {
  private attendanceRepository = new AttendanceRepository();
  private eventRepository = new EventRepository();

  async markQrAttendance(userId: string, qrToken: string): Promise<Attendance> {
    const event = await this.eventRepository.findById(qrToken);
    if (!event) {
      throw new NotFoundError('Event not found for this QR token');
    }

    const registration = await this.eventRepository.getRegistration(userId, event.id);
    if (!registration || registration.status !== 'REGISTERED') {
      throw new BadRequestError('You are not registered for this event');
    }

    const existingRecord = await this.attendanceRepository.getAttendanceRecord(userId, event.id);
    if (existingRecord) {
      throw new ConflictError('Attendance already checked-in for this event');
    }

    return this.attendanceRepository.mark(userId, event.id, AttendanceMethod.QR, 'QR_SCANNER');
  }

  async markManualAttendance(userId: string, eventId: string, method: AttendanceMethod, markedBy: string): Promise<Attendance> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const existingRecord = await this.attendanceRepository.getAttendanceRecord(userId, event.id);
    if (existingRecord) {
      throw new ConflictError('Attendance already marked for this user');
    }

    return this.attendanceRepository.mark(userId, eventId, method, markedBy);
  }

  async getReport(eventId: string): Promise<any[]> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return this.attendanceRepository.getReport(eventId);
  }
}
