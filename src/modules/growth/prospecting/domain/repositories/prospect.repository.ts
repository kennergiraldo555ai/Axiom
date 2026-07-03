import type { ProspectEntity } from "../entities/prospect.entity";
import type { ProspectQueryFilters, PaginatedResult } from "../dtos/prospect-query.dto";

export interface IProspectRepository {
  findById(id: string): Promise<ProspectEntity | null>;
  findByPlaceId(workspaceId: string, placeId: string): Promise<ProspectEntity | null>;

  query(
    workspaceId: string,
    filters: ProspectQueryFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<PaginatedResult<ProspectEntity>>;

  save(prospect: Omit<ProspectEntity, "id" | "createdAt" | "updatedAt">): Promise<ProspectEntity>;

  update(id: string, data: Partial<ProspectEntity>): Promise<ProspectEntity>;

  delete(id: string): Promise<void>; // Soft delete
}
