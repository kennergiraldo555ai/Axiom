import { logger } from "@/lib/observability/logger";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
import {
  ProspectQueryFiltersSchema,
  type ProspectQueryInput,
} from "../validators/prospect.validator";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { PaginatedResult, ProspectQueryFilters } from "../../domain/dtos/prospect-query.dto";

export class QueryProspectsUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: ProspectQueryInput): Promise<PaginatedResult<ProspectEntity>> {
    const validated = ProspectQueryFiltersSchema.parse(input);
    const { workspaceId, page, limit, sortBy, sortOrder, ...filters } = validated;

    const startTime = performance.now();
    logger.info({ workspaceId, page, limit, filters }, "Iniciando QueryProspectsUseCase");

    try {
      // Clean undefined values to satisfy exactOptionalPropertyTypes
      const cleanFilters = JSON.parse(JSON.stringify(filters)) as ProspectQueryFilters;

      const result = await this.prospectRepository.query(
        workspaceId,
        cleanFilters,
        page,
        limit,
        sortBy,
        sortOrder,
      );

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(
        {
          workspaceId,
          resultsCount: result.data.length,
          totalItems: result.total,
          durationMs,
        },
        "QueryProspectsUseCase completado",
      );

      return result;
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(
        {
          workspaceId,
          error: err.message,
        },
        "QueryProspectsUseCase fallido",
      );
      throw err;
    }
  }
}
