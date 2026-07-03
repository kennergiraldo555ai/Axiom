import { logger } from "@/lib/observability/logger";
import type {
  PlaceProviderId,
  PlaceResult,
  SearchPlacesRequest,
  IPlacesProviderAdapter,
} from "./types";

export class GooglePlacesAdapter implements IPlacesProviderAdapter {
  id: PlaceProviderId = "google";
  private apiKey: string;
  private baseUrl = "https://places.googleapis.com/v1/places";

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
  }

  async search(request: SearchPlacesRequest): Promise<PlaceResult[]> {
    if (!this.apiKey) {
      logger.warn({ provider: this.id }, "API key not configured");
      return [];
    }

    // Implementación usando fetch nativo para Google Places API (New)
    try {
      const response = await fetch(`${this.baseUrl}:searchText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.rating,places.primaryType",
        },
        body: JSON.stringify({
          textQuery: `${request.query} in ${request.location}`,
          pageSize: request.limit || 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Google API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.places) return [];

      return data.places.map((place: unknown): PlaceResult => {
        const p = place as Record<string, unknown>;
        return {
          id: p.id as string,
          name: ((p.displayName as Record<string, unknown>)?.text as string) || "Unknown",
          address: (p.formattedAddress as string) || "",
          category: (p.primaryType as string) || "business",
          ...(p.websiteUri ? { websiteUrl: p.websiteUri as string } : {}),
          ...(p.nationalPhoneNumber ? { phoneNumber: p.nationalPhoneNumber as string } : {}),
          ...(p.rating ? { rating: p.rating as number } : {}),
          provider: this.id,
        };
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error({ error: err.message, provider: this.id }, "Google Places search failed");
      throw error;
    }
  }

  async getDetails(_placeId: string): Promise<PlaceResult | null> {
    // Implementación futura si es necesaria, usando el field mask
    throw new Error("Not implemented");
  }
}
