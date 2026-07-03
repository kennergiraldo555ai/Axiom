export type AnalysisStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "SKIPPED";

export interface ProspectEntity {
  id: string;
  workspaceId: string;
  placeId: string; // Google Places ID (Idempotency key)

  // Basic Info
  name: string;
  categoryId: string | null;
  cityId: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;

  // Google specific info
  rating: number | null;
  userRatingsCount: number | null;
  priceLevel: number | null;
  businessStatus: string | null;
  googleUrl: string | null;
  lat: number | null;
  lng: number | null;

  // Raw data
  metadata: Record<string, unknown>; // Stores raw places response, hours, photos

  // Analysis Fields
  analysisStatus: AnalysisStatus;
  qualityScore: number | null; // 0-100
  scoreRationale: Record<string, unknown> | null;
  signals: Record<string, unknown> | null;
  opportunities: Record<string, unknown>[] | null;
  analyzedAt: Date | null;
  analyzedByModel: string | null;

  // Outreach Fields
  messageDraft: string | null;
  messageDraftModel: string | null;
  messageDraftAt: Date | null;
  messageEdited: string | null;
  userNotes: string | null;

  // Conversion
  convertedToLeadId: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
