"use server";

import { revalidatePath } from "next/cache";
import { SearchProspectsUseCase } from "../application/use-cases/search-prospects.use-case";
import { QueryProspectsUseCase } from "../application/use-cases/query-prospects.use-case";
import { AnalyzeProspectUseCase } from "../application/use-cases/analyze-prospect.use-case";
import { GenerateProposalUseCase } from "../application/use-cases/generate-proposal.use-case";
import { PrismaProspectRepository } from "../infrastructure/repositories/prisma-prospect.repository";
import { requireWorkspace } from "@/lib/auth/guards";
import { isAppError } from "@/lib/errors/typed-errors";
import type { ProspectQueryFilters } from "../domain/dtos/prospect-query.dto";

// Initialize repository and use cases
const prospectRepository = new PrismaProspectRepository();
const searchUseCase = new SearchProspectsUseCase(prospectRepository);
const queryUseCase = new QueryProspectsUseCase(prospectRepository);
const analyzeUseCase = new AnalyzeProspectUseCase(prospectRepository);
const generateProposalUseCase = new GenerateProposalUseCase(prospectRepository);

/**
 * Translates internal errors into user-friendly messages.
 * Never exposes Prisma, DB, UUID, or stack trace details.
 */
function getUserFriendlyError(error: unknown): string {
  const err = error as Error;
  const message = err.message || "";

  // Auth / workspace errors
  if (isAppError(error) && error.code === "UNAUTHORIZED") {
    return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
  }

  // Google Places / search service errors
  if (
    message.includes("Google") ||
    message.includes("búsqueda") ||
    message.includes("servicio de búsqueda") ||
    message.includes("API")
  ) {
    return message; // These are already user-friendly from the adapter
  }

  // Database / Prisma errors (never expose internals)
  if (
    message.includes("prisma") ||
    message.includes("database") ||
    message.includes("connect") ||
    message.includes("ECONNREFUSED") ||
    message.includes("P2")
  ) {
    return "Hubo un problema al guardar los datos. Por favor, intenta de nuevo en unos segundos.";
  }

  // AI errors
  if (message.includes("AI") || message.includes("IA") || message.includes("anthropic")) {
    return "El motor de inteligencia artificial no está disponible en este momento. Intenta más tarde.";
  }

  // Validation errors
  if (message.includes("Zod") || message.includes("validation") || message.includes("parse")) {
    return "Los datos ingresados no son válidos. Verifica e intenta de nuevo.";
  }

  // Generic fallback — never expose the raw message
  return "Ocurrió un problema inesperado. Por favor, intenta de nuevo.";
}

export async function searchProspectsAction(query: string, location: { lat: number; lng: number }) {
  try {
    const { workspaceId } = await requireWorkspace();

    const results = await searchUseCase.execute({
      workspaceId,
      query,
      location,
    });

    revalidatePath("/growth/prospecting");
    return { success: true as const, data: results };
  } catch (error) {
    console.error("Search prospects error:", error);
    return { success: false as const, error: getUserFriendlyError(error) };
  }
}

export async function getProspectsAction(filters: ProspectQueryFilters = {}) {
  try {
    const { workspaceId } = await requireWorkspace();

    const results = await queryUseCase.execute({
      workspaceId,
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...filters,
    });

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Get prospects error:", error);
    return { success: false as const, error: getUserFriendlyError(error) };
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
    return { success: true as const, data: result };
  } catch (error) {
    console.error("Analyze prospect error:", error);
    return { success: false as const, error: getUserFriendlyError(error) };
  }
}

export async function generateProposalAction(prospectId: string) {
  try {
    const { workspaceId } = await requireWorkspace();

    const result = await generateProposalUseCase.execute({
      workspaceId,
      prospectId,
    });

    revalidatePath("/growth/prospecting");
    return { success: true as const, data: result };
  } catch (error) {
    console.error("Generate proposal error:", error);
    return { success: false as const, error: getUserFriendlyError(error) };
  }
}
