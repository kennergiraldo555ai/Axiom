import type { ProspectEntity, AnalysisStatus } from "../entities/prospect.entity";
import type { PlaceResult } from "@/lib/adapters/places";

export class ProspectService {
  /**
   * Normaliza los datos de un PlaceResult hacia un ProspectEntity en memoria
   */
  static normalizeFromPlace(
    workspaceId: string,
    place: PlaceResult,
    categoryId: string | null = null,
    cityId: string | null = null,
  ): Omit<ProspectEntity, "id" | "createdAt" | "updatedAt"> {
    return {
      workspaceId,
      placeId: place.id,
      name: place.name,
      address: place.address || null,
      phone: place.phoneNumber || null,
      website: place.websiteUrl || null,
      rating: place.rating ?? null,
      userRatingsCount: place.userRatingsCount ?? null,
      priceLevel: null,
      businessStatus: "OPERATIONAL",
      googleUrl: place.googleMapsUrl || null,
      lat: place.lat ?? null,
      lng: place.lng ?? null,
      categoryId,
      cityId,
      email: null,
      metadata: {
        category: place.category,
        provider: place.provider,
        originalAddress: place.address,
      },
      analysisStatus: "PENDING" as AnalysisStatus,
      qualityScore: null,
      scoreRationale: null,
      signals: null,
      opportunities: null,
      analyzedAt: null,
      analyzedByModel: null,
      messageDraft: null,
      messageDraftModel: null,
      messageDraftAt: null,
      messageEdited: null,
      userNotes: null,
      convertedToLeadId: null,
      deletedAt: null,
    };
  }

  /**
   * Filtra los Places para remover aquellos que ya existen en la base de datos (por placeId)
   */
  static deduplicate(places: PlaceResult[], existingProspects: ProspectEntity[]): PlaceResult[] {
    const existingPlaceIds = new Set(existingProspects.map((p) => p.placeId));
    return places.filter((p) => !existingPlaceIds.has(p.id));
  }
}
