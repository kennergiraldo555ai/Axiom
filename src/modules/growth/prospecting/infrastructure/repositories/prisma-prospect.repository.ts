import { prisma } from "@/lib/db/client";
import { LeadSource, LeadStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type {
  ConvertProspectToLeadData,
  IProspectRepository,
} from "../../domain/repositories/prospect.repository";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { ProspectQueryFilters, PaginatedResult } from "../../domain/dtos/prospect-query.dto";

export class PrismaProspectRepository implements IProspectRepository {
  async findById(id: string): Promise<ProspectEntity | null> {
    const prospect = await prisma.prospect.findUnique({
      where: { id, deletedAt: null },
    });
    return prospect as ProspectEntity | null;
  }

  async findByPlaceId(workspaceId: string, placeId: string): Promise<ProspectEntity | null> {
    const prospect = await prisma.prospect.findUnique({
      where: {
        workspaceId_placeId: { workspaceId, placeId },
      },
    });
    if (prospect?.deletedAt) return null;
    return prospect as ProspectEntity | null;
  }

  async query(
    workspaceId: string,
    filters: ProspectQueryFilters,
    page: number,
    limit: number,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ): Promise<PaginatedResult<ProspectEntity>> {
    const skip = (page - 1) * limit;

    // Construir el where
    const where: Record<string, unknown> = {
      workspaceId,
      deletedAt: null,
    };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.cityId) where.cityId = filters.cityId;
    if (filters.analysisStatus) where.analysisStatus = filters.analysisStatus;
    if (filters.minQualityScore !== undefined) {
      const qs = (where.qualityScore as Record<string, unknown>) || {};
      where.qualityScore = { ...qs, gte: filters.minQualityScore };
    }
    if (filters.maxQualityScore !== undefined) {
      const qs = (where.qualityScore as Record<string, unknown>) || {};
      where.qualityScore = { ...qs, lte: filters.maxQualityScore };
    }
    if (filters.hasWebsite !== undefined) {
      where.website = filters.hasWebsite ? { not: null } : null;
    }
    if (filters.hasEmail !== undefined) {
      where.email = filters.hasEmail ? { not: null } : null;
    }
    if (filters.query) {
      where.name = { contains: filters.query, mode: "insensitive" };
    }

    const [total, data] = await Promise.all([
      prisma.prospect.count({ where }),
      prisma.prospect.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    return {
      data: data as ProspectEntity[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async save(
    prospectData: Omit<ProspectEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<ProspectEntity> {
    const prospect = await prisma.prospect.create({
      data: prospectData as unknown as Prisma.ProspectCreateInput,
    });
    return prospect as ProspectEntity;
  }

  async update(id: string, data: Partial<ProspectEntity>): Promise<ProspectEntity> {
    const prospect = await prisma.prospect.update({
      where: { id },
      data: data as unknown as Prisma.ProspectUpdateInput,
    });
    return prospect as ProspectEntity;
  }

  async convertToLead(data: ConvertProspectToLeadData): Promise<ProspectEntity> {
    return prisma.$transaction(async (tx) => {
      const prospect = await tx.prospect.findUniqueOrThrow({
        where: {
          id: data.prospectId,
          workspaceId: data.workspaceId,
          deletedAt: null,
        },
      });

      const lead = await tx.lead.create({
        data: {
          workspaceId: data.workspaceId,
          prospectId: prospect.id,
          name: prospect.name,
          businessName: prospect.name,
          email: prospect.email,
          phone: prospect.phone,
          website: prospect.website,
          source: LeadSource.PROSPECTING,
          status: LeadStatus.NEW,
          qualityScore: prospect.qualityScore,
          finalMessage: data.finalMessage,
          priority: this.getPriorityFromScore(prospect.qualityScore),
          metadata: {
            prospectPlaceId: prospect.placeId,
            convertedFromProspectingAt: new Date().toISOString(),
          } satisfies Prisma.InputJsonObject,
        },
      });

      await tx.leadEvent.create({
        data: {
          leadId: lead.id,
          eventType: "prospect_converted",
          metadata: {
            prospectId: prospect.id,
          } satisfies Prisma.InputJsonObject,
        },
      });

      const updatedProspect = await tx.prospect.update({
        where: { id: prospect.id },
        data: {
          convertedToLeadId: lead.id,
          messageEdited: data.finalMessage,
        },
      });

      return updatedProspect as ProspectEntity;
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.prospect.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private getPriorityFromScore(score: number | null): number {
    if (score === null) return 0;
    if (score >= 80) return 3;
    if (score >= 60) return 2;
    if (score >= 40) return 1;
    return 0;
  }
}
