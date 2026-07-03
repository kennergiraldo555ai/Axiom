/**
 * Cross-module shared types.
 * Spec §3.1: modules may import from src/modules/_shared/* freely.
 *
 * Only add types here that are genuinely used by multiple modules.
 * Module-specific types live in the module's own schema.ts.
 */

/** Standard pagination cursor for all list endpoints. Spec §10.5. */
export interface PaginationCursor {
  cursor: string | null;
  limit: number;
}

/** Paginated response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Workspace context — carried through all service calls. */
export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
}
