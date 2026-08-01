import { OpportunityRepository } from '../repositories/opportunity.repository';
import { Opportunity, OpportunityApplication, OpportunityType } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';
import { prisma } from '../config/db';

export class OpportunityService {
  private opportunityRepository = new OpportunityRepository();

  async getOpportunity(id: string): Promise<Opportunity> {
    const opp = await this.opportunityRepository.findById(id);
    if (!opp) {
      throw new NotFoundError('Opportunity listing not found');
    }
    return opp;
  }

  async createOpportunity(
    postedById: string,
    data: {
      title: string;
      description: string;
      type: OpportunityType;
      company?: string;
      deadline: string;
      location?: string;
      requirements?: string;
      link?: string;
    }
  ): Promise<Opportunity> {
    return this.opportunityRepository.create({
      ...data,
      deadline: new Date(data.deadline),
      postedById,
    });
  }

  async getOpportunities(type?: OpportunityType): Promise<Opportunity[]> {
    return this.opportunityRepository.findAll(type);
  }

  async apply(opportunityId: string, userId: string, resumeUrl?: string): Promise<OpportunityApplication> {
    await this.getOpportunity(opportunityId);

    const existing = await prisma.opportunityApplication.findUnique({
      where: {
        opportunityId_userId: { opportunityId, userId },
      },
    });

    if (existing) {
      throw new ConflictError('You have already applied for this opportunity.');
    }

    return this.opportunityRepository.apply(opportunityId, userId, resumeUrl);
  }

  async getApplications(opportunityId: string): Promise<any[]> {
    await this.getOpportunity(opportunityId);
    return this.opportunityRepository.getApplications(opportunityId);
  }
}
