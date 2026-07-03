import type { AnalysisStatus } from "../entities/prospect.entity";

export interface ProspectQueryFilters {
  categoryId?: string;
  cityId?: string;
  analysisStatus?: AnalysisStatus;
  minQualityScore?: number;
  maxQualityScore?: number;
  hasWebsite?: boolean;
  hasEmail?: boolean;
  query?: string; // Búsqueda de texto por nombre
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
