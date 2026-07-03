import { logger } from "@/lib/observability/logger";
import type {
  PlaceProviderId,
  SearchPlacesRequest,
  PlaceResult,
  IPlacesProviderAdapter,
} from "./types";
import { GooglePlacesAdapter } from "./google";

class PlacesRouter {
  private adapters: Map<string, IPlacesProviderAdapter> = new Map();

  constructor() {
    this.adapters.set("google", new GooglePlacesAdapter());
  }

  async search(provider: PlaceProviderId, request: SearchPlacesRequest): Promise<PlaceResult[]> {
    const adapter = this.adapters.get(provider);

    if (!adapter) {
      const err = new Error(`Places Provider ${provider} no está implementado`);
      logger.error({ error: err.message, provider }, "Places Provider not found");
      throw err;
    }

    const startTime = performance.now();
    try {
      const results = await adapter.search(request);

      logger.info(
        {
          placesProvider: provider,
          searchQuery: request.query,
          searchLocation: request.location,
          resultsCount: results.length,
          durationMs: Math.round(performance.now() - startTime),
        },
        "Búsqueda de Places exitosa",
      );

      return results;
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(
        {
          placesProvider: provider,
          searchQuery: request.query,
          error: err.message || err.toString(),
        },
        "Búsqueda de Places fallida",
      );
      throw error;
    }
  }
}

export const placesRouter = new PlacesRouter();
