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
import { Skeleton } from "@/modules/_shared/components/Skeleton";
import { EmptyState } from "@/modules/_shared/components/EmptyState";
import { Star, Building2 } from "lucide-react";
import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectTableProps {
  prospects: ProspectEntity[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (prospect: ProspectEntity) => void;
}

export function ProspectTable({ prospects, isLoading, selectedId, onSelect }: ProspectTableProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center space-x-4 border-b border-[var(--c-border-subtle)] p-6">
          <Skeleton className="h-3 w-[150px] opacity-50" />
          <Skeleton className="h-3 w-[100px] opacity-50" />
          <Skeleton className="h-3 w-[80px] opacity-50" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-6 p-6 border-b border-[var(--c-border-subtle)]"
          >
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-5 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  if (prospects.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Building2 className="h-8 w-8 opacity-50" />}
          title="No prospects found"
          description="Adjust your search filters to discover new businesses."
        />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Business</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Reputation</TableHead>
          <TableHead>AI Analysis</TableHead>
          <TableHead className="text-right">Quality Score</TableHead>
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
                  {prospect.categoryId || "Unknown Category"}
                  <span className="opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center ml-3 text-[var(--c-accent)] font-medium">
                    View Details
                  </span>
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-[var(--c-text-secondary)] text-sm">
                {prospect.cityId || "Unknown City"}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[var(--c-warning)] fill-[var(--c-warning)]" />
                <span className="text-[var(--c-text-primary)] font-medium">
                  {prospect.rating || "N/A"}
                </span>
                <span className="text-[11px] text-[var(--c-text-tertiary)]">
                  ({prospect.userRatingsCount || 0})
                </span>
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
      return <Badge variant="success">Completed</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="info">Analyzing...</Badge>;
    case "PENDING":
      return <Badge variant="outline">Pending</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
