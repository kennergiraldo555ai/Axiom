"use server";

import { revalidatePath } from "next/cache";
import { SearchProspectsUseCase } from "../application/use-cases/search-prospects.use-case";
import { QueryProspectsUseCase } from "../application/use-cases/query-prospects.use-case";
import { AnalyzeProspectUseCase } from "../application/use-cases/analyze-prospect.use-case";
import { GenerateProposalUseCase } from "../application/use-cases/generate-proposal.use-case";
import { ConvertProspectToLeadUseCase } from "../application/use-cases/convert-prospect-to-lead.use-case";
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
const convertProspectToLeadUseCase = new ConvertProspectToLeadUseCase(prospectRepository);

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
  const lowerMsg = message.toLowerCase();
  if (
    lowerMsg.includes("credit balance is too low") ||
    lowerMsg.includes("400") ||
    lowerMsg.includes("401") ||
    lowerMsg.includes("403") ||
    lowerMsg.includes("429") ||
    lowerMsg.includes("500") ||
    lowerMsg.includes("502") ||
    lowerMsg.includes("503") ||
    lowerMsg.includes("anthropic") ||
    lowerMsg.includes("ia") ||
    lowerMsg.includes("ai")
  ) {
    if (lowerMsg.includes("credit") || lowerMsg.includes("400")) {
      return "No fue posible ejecutar el análisis porque el servicio de Inteligencia Artificial no tiene créditos disponibles. Contacta al administrador para recargar el servicio y vuelve a intentarlo.";
    }
    if (
      lowerMsg.includes("401") ||
      lowerMsg.includes("api key") ||
      lowerMsg.includes("authentication")
    ) {
      return "Error de autenticación con la IA. La llave de acceso (API Key) es inválida o ha expirado.";
    }
    if (lowerMsg.includes("403") || lowerMsg.includes("permission")) {
      return "Error de permisos. La llave de acceso no tiene autorización para realizar esta acción.";
    }
    if (lowerMsg.includes("429") || lowerMsg.includes("rate limit")) {
      return "El servicio de Inteligencia Artificial está saturado en este momento (Rate Limit). Por favor, intenta de nuevo en unos minutos.";
    }
    if (lowerMsg.includes("500") || lowerMsg.includes("502") || lowerMsg.includes("503")) {
      return "El proveedor de Inteligencia Artificial está experimentando problemas técnicos. Intenta más tarde.";
    }
    return "Ocurrió un error al comunicarse con el proveedor de Inteligencia Artificial.";
  }

  // Conversion errors
  if (message.includes("already been converted")) {
    return "Este prospecto ya fue convertido en cliente potencial.";
  }

  if (message.includes("before the AI analysis")) {
    return "Primero debes completar el análisis IA antes de convertir el prospecto.";
  }

  if (message.includes("finalMessage") || message.includes("too_small")) {
    return "La propuesta final debe tener al menos 20 caracteres.";
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

export async function getProspectsAction(filters: ProspectQueryFilters = {}, page = 1, limit = 20) {
  try {
    const { workspaceId } = await requireWorkspace();

    const results = await queryUseCase.execute({
      workspaceId,
      page,
      limit,
      sortBy: "qualityScore",
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

export async function convertProspectToLeadAction(prospectId: string, finalMessage: string) {
  try {
    const { workspaceId } = await requireWorkspace();

    const result = await convertProspectToLeadUseCase.execute({
      workspaceId,
      prospectId,
      finalMessage,
    });

    revalidatePath("/growth/prospecting");
    revalidatePath("/crm");
    return { success: true as const, data: result };
  } catch (error) {
    console.error("Convert prospect to lead error:", error);
    return { success: false as const, error: getUserFriendlyError(error) };
  }
}
