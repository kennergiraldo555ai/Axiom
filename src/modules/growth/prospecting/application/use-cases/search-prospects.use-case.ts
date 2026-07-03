import { logger } from "@/lib/observability/logger";
import { placesRouter } from "@/lib/adapters/places";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
import { ProspectService } from "../../domain/services/prospect.service";
import {
  SearchGooglePlacesInputSchema,
  type SearchGooglePlacesInput,
} from "../validators/prospect.validator";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";

export class SearchProspectsUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: SearchGooglePlacesInput): Promise<ProspectEntity[]> {
    const validated = SearchGooglePlacesInputSchema.parse(input);
    const { workspaceId, query, location } = validated;

    const startTime = performance.now();
    logger.info({ workspaceId, query, location }, "Iniciando SearchProspectsUseCase");

    try {
      // 1. Obtener prospectos crudos del Provider (Agnóstico, actualmente Google)
      const places = await placesRouter.search("google", {
        query,
        location: `${location.lat},${location.lng}`,
      });

      if (places.length === 0) {
        return [];
      }

      // 2. Extraer IDs para deduplicación
      const placeIds = places.map((p) => p.id);

      // 3. Obtener prospectos existentes (usando query o múltiples finds, aquí simularemos con un loop por ahora
      // idealmente habría un findByPlaceIds en el repositorio)
      // Para optimizar en Prisma, idealmente agregar `findByPlaceIds`
      const existingProspects: ProspectEntity[] = [];
      for (const placeId of placeIds) {
        const existing = await this.prospectRepository.findByPlaceId(workspaceId, placeId);
        if (existing) {
          existingProspects.push(existing);
        }
      }

      // 4. Deduplicar usando el servicio de dominio
      const newPlaces = ProspectService.deduplicate(places, existingProspects);

      // 5. Normalizar y persistir nuevos
      const savedProspects: ProspectEntity[] = [];
      for (const place of newPlaces) {
        const prospectData = ProspectService.normalizeFromPlace(workspaceId, place);
        const saved = await this.prospectRepository.save(prospectData);
        savedProspects.push(saved);
      }

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(
        {
          workspaceId,
          query,
          resultsCount: places.length,
          newProspectsCount: savedProspects.length,
          durationMs,
        },
        "SearchProspectsUseCase completado",
      );

      return savedProspects;
    } catch (error: unknown) {
      const err = error as Error;
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
