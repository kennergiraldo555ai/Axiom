import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/modules/_shared/components/DataTable";
import { Badge } from "@/modules/_shared/components/Badge";
import { Star, MapPin } from "lucide-react";
import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectTableProps {
  prospects: ProspectEntity[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (prospect: ProspectEntity) => void;
}

/**
 * Extracts a human-readable category label from the prospect's metadata.
 * Falls back to a formatted version of the Google Places primaryType.
 */
function getCategoryLabel(prospect: ProspectEntity): string {
  const metadata = prospect.metadata as Record<string, unknown> | null;
  const category = (metadata?.category as string) || "";
  if (category && category !== "business") {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return "Negocio";
}

/**
 * Extracts a short location label from the address.
 */
function getShortLocation(prospect: ProspectEntity): string {
  if (!prospect.address) return "Sin ubicación";
  // Take the last 2-3 parts of the address (city, state, country)
  const parts = prospect.address.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    return parts.slice(-2).join(", ");
  }
  return prospect.address;
}

export function ProspectTable({ prospects, isLoading, selectedId, onSelect }: ProspectTableProps) {
  // The parent ProspectLayout now handles loading/empty states,
  // so this component only renders when there are prospects.
  if (isLoading) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Negocio</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Reputación</TableHead>
          <TableHead>Análisis IA</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => (
          <TableRow
            key={prospect.id}
            selected={selectedId === prospect.id}
            onClick={() => onSelect(prospect)}
            className="cursor-pointer"
          >
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[var(--c-text-primary)]">{prospect.name}</span>
                <span className="text-[11px] text-[var(--c-text-tertiary)] flex items-center">
                  {getCategoryLabel(prospect)}
                  {prospect.website && (
                    <>
                      <span className="mx-1.5 opacity-30">•</span>
                      <span className="text-[var(--c-accent)]">Tiene web</span>
                    </>
                  )}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-[var(--c-text-secondary)] text-sm">
                <MapPin className="w-3 h-3 text-[var(--c-text-tertiary)] shrink-0" />
                <span className="truncate max-w-[180px]">{getShortLocation(prospect)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[var(--c-warning)] fill-[var(--c-warning)]" />
                <span className="text-[var(--c-text-primary)] font-medium">
                  {prospect.rating || "—"}
                </span>
                {prospect.userRatingsCount !== null && prospect.userRatingsCount > 0 && (
                  <span className="text-[11px] text-[var(--c-text-tertiary)]">
                    ({prospect.userRatingsCount.toLocaleString()})
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <AnalysisBadge status={prospect.analysisStatus} />
            </TableCell>
            <TableCell className="text-right">
              {prospect.qualityScore ? (
                <span
                  className={`font-mono text-sm font-medium ${prospect.qualityScore >= 80 ? "text-[var(--c-success)]" : prospect.qualityScore >= 50 ? "text-[var(--c-warning)]" : "text-[var(--c-danger)]"}`}
                >
                  {prospect.qualityScore}
                </span>
              ) : (
                <span className="text-[var(--c-text-tertiary)]">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AnalysisBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Analizado</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="info">Analizando...</Badge>;
    case "PENDING":
      return <Badge variant="outline">Pendiente</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
