import { logger } from "@/lib/observability/logger";
import { placesRouter } from "@/lib/adapters/places";
import { prisma } from "@/lib/db/client";
import { getVariantsForCategory } from "@/lib/config/prospect-categories";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
import { ProspectService } from "../../domain/services/prospect.service";
import {
  SearchGooglePlacesInputSchema,
  type SearchGooglePlacesInput,
} from "../validators/prospect.validator";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { PlaceResult } from "@/lib/adapters/places/types";

export class SearchProspectsUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: SearchGooglePlacesInput): Promise<ProspectEntity[]> {
    const validated = SearchGooglePlacesInputSchema.parse(input);
    const { workspaceId, query, location } = validated;

    // Use a basic city string extraction for SearchSession metadata
    const city = query.split(" en ")[1] || "Unknown City";
    const country = "Unknown Country"; // Can be expanded if needed

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 1. Revisar caché persistente (SearchSession)
    const existingSession = await prisma.searchSession.findFirst({
      where: {
        workspaceId,
        query,
        city,
        status: "COMPLETED",
        updatedAt: { gte: sevenDaysAgo },
      },
    });

    if (existingSession) {
      logger.info({ workspaceId, query }, "Using cached search session (Rendimiento)");
      const prospectIds = (existingSession.prospectIds as string[]) || [];
      if (prospectIds.length > 0) {
        const cachedProspects = await prisma.prospect.findMany({
          where: { id: { in: prospectIds } },
          orderBy: { qualityScore: "desc" },
        });
        return cachedProspects as unknown as ProspectEntity[];
      }
    }

    const startTime = performance.now();
    logger.info({ workspaceId, query, location }, "Iniciando SearchProspectsUseCase con Variantes");

    // 2. Obtener Variantes Inteligentes
    const categoryName = query.split(" en ")[0] || query;
    const variants = getVariantsForCategory(categoryName);

    // 3. Registrar la Sesión
    const session = await prisma.searchSession.create({
      data: {
        workspaceId,
        query,
        city,
        country,
        variants,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    try {
      // 4. Concurrencia Controlada (Chunks de 2 o 3)
      const MAX_CONCURRENT = 3;
      const allPlaces: PlaceResult[] = [];
      let googleCalls = 0;

      for (let i = 0; i < variants.length; i += MAX_CONCURRENT) {
        const chunk = variants.slice(i, i + MAX_CONCURRENT);
        const chunkPromises = chunk.map((variant) => {
          googleCalls++;
          return placesRouter.search("google", {
            query: `${variant} en ${city}, ${country}`,
            location: `${location.lat},${location.lng}`,
          });
        });

        const chunkResults = await Promise.all(chunkPromises);
        chunkResults.forEach((res) => allPlaces.push(...res));
      }

      if (allPlaces.length === 0) {
        await prisma.searchSession.update({
          where: { id: session.id },
          data: { status: "COMPLETED", finishedAt: new Date() },
        });
        return [];
      }

      // 5. Deduplicación Avanzada
      const placeIds = allPlaces.map((p) => p.id);
      const phones = allPlaces.map((p) => p.phoneNumber).filter(Boolean) as string[];

      const existingProspects = await prisma.prospect.findMany({
        where: {
          workspaceId,
          OR: [{ placeId: { in: placeIds } }, { phone: { in: phones, not: "" } }],
        },
      });

      const newPlaces = ProspectService.deduplicate(
        allPlaces,
        existingProspects as unknown as ProspectEntity[],
      );

      // 6. Generar Prospectos Nuevos con Opportunity Score Híbrido Inmediato
      const savedProspects: ProspectEntity[] = [];
      for (const place of newPlaces) {
        const prospectData = ProspectService.normalizeFromPlace(workspaceId, place);
        const saved = await this.prospectRepository.save(prospectData);
        savedProspects.push(saved);
      }

      const finalResults = [
        ...(existingProspects as unknown as ProspectEntity[]),
        ...savedProspects,
      ];
      const finalIds = finalResults.map((p) => p.id);

      // 7. Cerrar la Sesión de Búsqueda
      await prisma.searchSession.update({
        where: { id: session.id },
        data: {
          status: "COMPLETED",
          finishedAt: new Date(),
          totalFound: finalResults.length,
          googleCalls,
          prospectIds: finalIds,
        },
      });

      // Sort local results by score for the current response
      finalResults.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(
        {
          workspaceId,
          query,
          resultsCount: allPlaces.length,
          newProspectsCount: savedProspects.length,
          existingCount: existingProspects.length,
          durationMs,
        },
        "SearchProspectsUseCase completado",
      );

      return finalResults;
    } catch (error: unknown) {
      const err = error as Error;
      await prisma.searchSession
        .update({
          where: { id: session.id },
          data: { status: "FAILED", finishedAt: new Date() },
        })
        .catch((e) => logger.error({ err: e }, "Failed to mark session as failed"));

      logger.error(
        {
          workspaceId,
          query,
          error: err.message,
        },
        "SearchProspectsUseCase fallido",
      );
      throw err;
    }
  }
}
