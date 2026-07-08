import { logger } from "@/lib/observability/logger";
import type {
  PlaceProviderId,
  PlaceResult,
  SearchPlacesRequest,
  IPlacesProviderAdapter,
} from "./types";

export class GooglePlacesAdapter implements IPlacesProviderAdapter {
  id: PlaceProviderId = "google";
  private baseUrl = "https://places.googleapis.com/v1/places";

  /** Lazy-load the API key so it always picks up the latest env value */
  private get apiKey(): string {
    return process.env.GOOGLE_PLACES_API_KEY || "";
  }

  async search(request: SearchPlacesRequest): Promise<PlaceResult[]> {
    if (!this.apiKey) {
      logger.warn({ provider: this.id }, "GOOGLE_PLACES_API_KEY not configured");
      throw new Error(
        "El servicio de búsqueda de negocios no está configurado. Contacta al administrador.",
      );
    }

    try {
      // Parse lat,lng from the location string
      const parts = request.location.split(",").map((s) => s.trim());
      const lat = parseFloat(parts[0] ?? "0");
      const lng = parseFloat(parts[1] ?? "0");

      const requestBody: Record<string, unknown> = {
        textQuery: request.query,
        pageSize: request.limit || 20,
      };

      // Add locationBias so results are centered around the user's selected city
      if (!isNaN(lat) && !isNaN(lng)) {
        requestBody.locationBias = {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 15000.0, // 15km radius
          },
        };
      }

      const response = await fetch(`${this.baseUrl}:searchText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.apiKey,
          "X-Goog-FieldMask": [
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.websiteUri",
            "places.nationalPhoneNumber",
            "places.rating",
            "places.userRatingCount",
            "places.primaryType",
            "places.googleMapsUri",
            "places.location",
            "places.photos",
            "places.regularOpeningHours",
          ].join(","),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        logger.error(
          { status: response.status, body: errorBody, provider: this.id },
          "Google Places API error response",
        );
        throw new Error(
          `No pudimos conectar con el servicio de búsqueda (código ${response.status}). Intenta de nuevo.`,
        );
      }

      const data = await response.json();

      if (!data.places) return [];

      return data.places.map((place: unknown): PlaceResult => {
        const p = place as Record<string, unknown>;
        const location = p.location as Record<string, number> | undefined;

        return {
          id: p.id as string,
          name: ((p.displayName as Record<string, unknown>)?.text as string) || "Unknown",
          address: (p.formattedAddress as string) || "",
          category: (p.primaryType as string) || "business",
          ...(p.websiteUri ? { websiteUrl: p.websiteUri as string } : {}),
          ...(p.nationalPhoneNumber ? { phoneNumber: p.nationalPhoneNumber as string } : {}),
          ...(typeof p.rating === "number" ? { rating: p.rating } : {}),
          ...(typeof p.userRatingCount === "number" ? { userRatingsCount: p.userRatingCount } : {}),
          ...(p.googleMapsUri ? { googleMapsUrl: p.googleMapsUri as string } : {}),
          ...(location?.latitude ? { lat: location.latitude } : {}),
          ...(location?.longitude ? { lng: location.longitude } : {}),
          provider: this.id,
          metadata: {
            photos: Array.isArray(p.photos)
              ? p.photos.map((photo: unknown) => (photo as Record<string, unknown>).name)
              : undefined,
            hours: p.regularOpeningHours
              ? (p.regularOpeningHours as Record<string, unknown>).weekdayDescriptions
              : undefined,
          },
        };
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error({ error: err.message, provider: this.id }, "Google Places search failed");
      throw error;
    }
  }

  async getDetails(_placeId: string): Promise<PlaceResult | null> {
    throw new Error("Not implemented");
  }
}
