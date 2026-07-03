import { prisma } from "@/lib/db/client";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: prospectData as any,
    });
    return prospect as ProspectEntity;
  }

  async update(id: string, data: Partial<ProspectEntity>): Promise<ProspectEntity> {
    const prospect = await prisma.prospect.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    });
    return prospect as ProspectEntity;
  }

  async delete(id: string): Promise<void> {
    await prisma.prospect.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
