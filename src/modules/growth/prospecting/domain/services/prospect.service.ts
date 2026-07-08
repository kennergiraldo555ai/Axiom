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
        ...(place.metadata || {}),
      },
      analysisStatus: "PENDING" as AnalysisStatus,
      qualityScore: ProspectService.calculateObjectiveScore(place),
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
   * Calculates an objective score based on available data before AI analysis
   */
  private static calculateObjectiveScore(place: PlaceResult): number {
    let score = 0;

    // Rating & Reviews (max 40)
    if (place.rating) {
      score += (place.rating / 5) * 30; // Max 30 points for a 5.0 rating
    }
    if (place.userRatingsCount) {
      score += Math.min(place.userRatingsCount / 5, 10); // 1 point per 5 reviews, max 10
    }

    // Contact & Online Presence (max 35)
    if (place.websiteUrl) score += 15;
    if (place.phoneNumber) score += 10;
    if (place.googleMapsUrl) score += 10;

    // Metadata completion (max 10)
    if (
      place.metadata?.photos &&
      Array.isArray(place.metadata.photos) &&
      place.metadata.photos.length > 0
    )
      score += 5;
    if (place.metadata?.hours) score += 5;

    // Penalties
    if (place.rating && place.rating < 3.5) score -= 15; // Low rating
    if (place.userRatingsCount && place.userRatingsCount < 5) score -= 10; // Not enough reviews

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Filtra los Places para remover aquellos que ya existen en la base de datos y los duplicados internos.
   * Criterios confiables contra DB: placeId exacto, teléfono exacto.
   * Criterio por nombre: solo entre los resultados NUEVOS de la búsqueda actual (para evitar duplicados entre variantes).
   * La comparación por nombre normalizado contra DB fue eliminada porque era demasiado agresiva
   * y descartaba negocios válidos con nombres similares pero distintos.
   */
  static deduplicate(places: PlaceResult[], existingProspects: ProspectEntity[]): PlaceResult[] {
    // Identificadores inequívocos contra la DB
    const existingPlaceIds = new Set(existingProspects.map((p) => p.placeId));
    const existingPhones = new Set(existingProspects.map((p) => p.phone).filter(Boolean));

    const uniquePlaces: PlaceResult[] = [];

    for (const place of places) {
      // 1. Descarte preciso contra prospectos ya en DB
      if (existingPlaceIds.has(place.id)) continue;
      if (place.phoneNumber && existingPhones.has(place.phoneNumber)) continue;

      // 2. Descarte por duplicados internos entre variantes (misma búsqueda)
      if (uniquePlaces.some((up) => up.id === place.id)) continue;
      if (place.phoneNumber && uniquePlaces.some((up) => up.phoneNumber === place.phoneNumber))
        continue;

      // Nota: no se compara por nombre normalizado para evitar falsos positivos
      // (p.ej. "Barbería El Rey" vs "Barbería El Rey Jr." colapsarían incorrectamente)

      uniquePlaces.push(place);
    }

    return uniquePlaces;
  }
}
