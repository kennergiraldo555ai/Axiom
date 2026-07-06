import { z } from "zod";

export const SearchGooglePlacesInputSchema = z.object({
  workspaceId: z.string().min(1),
  query: z.string().min(3),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().max(50000).optional(), // Max 50km
  }),
});

export type SearchGooglePlacesInput = z.infer<typeof SearchGooglePlacesInputSchema>;

export const ProspectQueryFiltersSchema = z.object({
  workspaceId: z.string().min(1),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  categoryId: z.string().min(1).optional(),
  cityId: z.string().min(1).optional(),
  analysisStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "SKIPPED"]).optional(),
  minQualityScore: z.number().min(0).max(100).optional(),
  maxQualityScore: z.number().min(0).max(100).optional(),
  hasWebsite: z.boolean().optional(),
  hasEmail: z.boolean().optional(),
  query: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProspectQueryInput = z.infer<typeof ProspectQueryFiltersSchema>;
