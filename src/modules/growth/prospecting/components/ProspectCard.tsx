import * as React from "react";
import { Card } from "@/modules/_shared/components/Card";
import { Badge } from "@/modules/_shared/components/Badge";
import { Star, MapPin, Globe, Phone, Sparkles } from "lucide-react";
import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectCardProps {
  prospect: ProspectEntity;
  isSelected: boolean;
  onClick: (prospect: ProspectEntity) => void;
}

function getCategoryLabel(prospect: ProspectEntity): string {
  const metadata = prospect.metadata as Record<string, unknown> | null;
  const category = (metadata?.category as string) || "";
  if (category && category !== "business") {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return "Negocio";
}

function getShortLocation(prospect: ProspectEntity): string {
  return prospect.address || "Sin ubicación";
}

export function ProspectCard({ prospect, isSelected, onClick }: ProspectCardProps) {
  const rating = prospect.rating || 0;
  const reviewsCount = prospect.userRatingsCount || 0;
  const hasAnalysis = prospect.analysisStatus === "COMPLETED";

  return (
    <Card
      variant={isSelected ? "premium" : "default"}
      onClick={() => onClick(prospect)}
      className={`relative cursor-pointer group hover:-translate-y-1 ${isSelected ? "ring-2 ring-[var(--c-accent)]" : ""}`}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header: Name and Category */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base leading-tight text-[var(--c-text-primary)] group-hover:text-[var(--c-accent-hover)] transition-colors line-clamp-1">
              {prospect.name}
            </h3>
            <span className="text-[12px] font-medium text-[var(--c-text-secondary)]">
              {getCategoryLabel(prospect)}
            </span>
          </div>
          {hasAnalysis && (
            <Badge variant="ai" className="shrink-0">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Ready
            </Badge>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-[13px] text-[var(--c-text-secondary)]">
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--c-text-tertiary)] shrink-0" />
            <span className="truncate">{getShortLocation(prospect)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-[var(--c-warning)] fill-[var(--c-warning)] shrink-0" />
            <span className="font-medium text-[var(--c-text-primary)]">{rating.toFixed(1)}</span>
            <span>({reviewsCount})</span>
          </div>
          <div className="flex items-center gap-2">
            {prospect.website ? (
              <>
                <Globe className="w-3.5 h-3.5 text-[var(--c-info)] shrink-0" />
                <span className="truncate">Web</span>
              </>
            ) : prospect.phone ? (
              <>
                <Phone className="w-3.5 h-3.5 text-[var(--c-success)] shrink-0" />
                <span className="truncate">{prospect.phone}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Footer: Score / Status */}
        <div className="mt-2 pt-4 border-t border-[var(--c-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {prospect.convertedToLeadId ? (
              <Badge variant="success">En CRM</Badge>
            ) : (
              <span className="text-[12px] text-[var(--c-text-tertiary)]">Prospecto</span>
            )}
          </div>
          {prospect.qualityScore && prospect.qualityScore > 0 ? (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[var(--c-text-tertiary)] uppercase tracking-wider font-semibold">
                Score
              </span>
              <span className="text-lg font-bold text-[var(--c-text-primary)] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-cyan)]">
                {prospect.qualityScore}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
