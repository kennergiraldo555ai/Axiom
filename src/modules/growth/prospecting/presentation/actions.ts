"use server";

import { revalidatePath } from "next/cache";
import { SearchProspectsUseCase } from "../application/use-cases/search-prospects.use-case";
import { QueryProspectsUseCase } from "../application/use-cases/query-prospects.use-case";
import { AnalyzeProspectUseCase } from "../application/use-cases/analyze-prospect.use-case";
import { PrismaProspectRepository } from "../infrastructure/repositories/prisma-prospect.repository";
import { requireWorkspace } from "@/lib/auth/guards";
import type { ProspectQueryFilters } from "../domain/dtos/prospect-query.dto";

// Initialize repository and use cases
const prospectRepository = new PrismaProspectRepository();
const searchUseCase = new SearchProspectsUseCase(prospectRepository);
const queryUseCase = new QueryProspectsUseCase(prospectRepository);
const analyzeUseCase = new AnalyzeProspectUseCase(prospectRepository);

export async function searchProspectsAction(query: string, location: { lat: number; lng: number }) {
  try {
    const { workspaceId } = await requireWorkspace();

    const results = await searchUseCase.execute({
      workspaceId,
      query,
      location,
    });

    revalidatePath("/growth/prospecting");
    return { success: true, data: results };
  } catch (error) {
    console.error("Search prospects error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getProspectsAction(filters: ProspectQueryFilters = {}) {
  try {
    const { workspaceId } = await requireWorkspace();

    const results = await queryUseCase.execute({
      workspaceId,
      page: 1,
      limit: 100, // Fixed limit for MVP
      sortBy: "createdAt",
      sortOrder: "desc",
      ...filters,
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Get prospects error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function analyzeProspectAction(prospectId: string) {
  try {
    const { workspaceId } = await requireWorkspace();

    const result = await analyzeUseCase.execute({
      workspaceId,
      prospectId,
      forceReanalyze: false,
    });

    revalidatePath("/growth/prospecting");
    return { success: true, data: result };
  } catch (error) {
    console.error("Analyze prospect error:", error);
    return { success: false, error: (error as Error).message };
  }
}
