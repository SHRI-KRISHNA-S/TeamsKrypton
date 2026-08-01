import { prisma } from '../config/db';
import { Opportunity, OpportunityApplication, OpportunityType, ApplicationStatus } from '@prisma/client';

export class OpportunityRepository {
  async create(data: {
    title: string;
    description: string;
    type: OpportunityType;
    company?: string;
    deadline: Date;
    location?: string;
    requirements?: string;
    link?: string;
    postedById: string;
  }): Promise<Opportunity> {
    return prisma.opportunity.create({
      data,
    });
  }

  async findById(id: string): Promise<Opportunity | null> {
    return prisma.opportunity.findUnique({
      where: { id },
    });
  }

  async findAll(type?: OpportunityType): Promise<Opportunity[]> {
    return prisma.opportunity.findMany({
      where: type ? { type } : {},
      orderBy: { deadline: 'asc' },
    });
  }

  async apply(opportunityId: string, userId: string, resumeUrl?: string): Promise<OpportunityApplication> {
    return prisma.opportunityApplication.create({
      data: {
        opportunityId,
        userId,
        resumeUrl,
        status: ApplicationStatus.PENDING,
      },
    });
  }

  async getApplications(opportunityId: string): Promise<any[]> {
    return prisma.opportunityApplication.findMany({
      where: { opportunityId },
      include: {
        user: {
          select: { id: true, name: true, email: true, department: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
