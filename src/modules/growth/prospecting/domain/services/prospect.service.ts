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
      rating: place.rating || null,
      userRatingsCount: null, // Si el adapter expone esto, mapearlo
      priceLevel: null,
      businessStatus: "OPERATIONAL", // Default or mapped
      googleUrl: null,
      lat: null,
      lng: null,
      categoryId,
      cityId,
      email: null,
      metadata: place as unknown as Record<string, unknown>,
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
