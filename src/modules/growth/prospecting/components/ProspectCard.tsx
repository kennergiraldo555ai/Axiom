import * as React from "react";
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

function getCoverPhotoId(prospect: ProspectEntity): string | null {
  const metadata = prospect.metadata as Record<string, unknown> | null;
  const photos = metadata?.photos;
  return Array.isArray(photos) && typeof photos[0] === "string" ? photos[0] : null;
}

export function ProspectCard({ prospect, isSelected, onClick }: ProspectCardProps) {
  const rating = prospect.rating || 0;
  const reviewsCount = prospect.userRatingsCount || 0;
  const hasAnalysis = prospect.analysisStatus === "COMPLETED";
  const score = prospect.qualityScore || 0;
  const category = getCategoryLabel(prospect);
  const coverPhotoId = getCoverPhotoId(prospect);
  const coverImage = coverPhotoId
    ? `/api/places/photo?id=${encodeURIComponent(coverPhotoId)}`
    : null;

  return (
    <div
      onClick={() => onClick(prospect)}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--r-2xl)] border bg-[var(--c-bg-base)] p-1.5 transition-all duration-500 ease-out hover:-translate-y-1.5 ${
        isSelected
          ? "border-[var(--c-primary)] shadow-[0_24px_50px_-20px_rgb(99_102_241_/_0.8)]"
          : "border-[var(--c-border-strong)] shadow-tactile hover:border-[var(--c-border-hover)] hover:shadow-glow"
      }`}
    >
      {/* Inner Container */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)]">
        {/* Header Image Area */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[var(--c-bg-subtle)]">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_40%,var(--c-bg-elevated)_100%)]" />
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={prospect.name}
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--c-primary-subtle),var(--c-bg-subtle))]">
              <span className="font-display text-5xl font-black text-[var(--c-primary)] opacity-20">
                {prospect.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 z-20 flex gap-2">
            {hasAnalysis && (
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--c-secondary-border)] bg-[var(--c-bg-glass)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--c-secondary)] shadow-[0_0_14px_-6px_rgb(34_211_238_/_0.9)] backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                IA Analyzed
              </div>
            )}
          </div>

          {score > 0 && (
            <div className="absolute right-4 top-4 z-20 flex h-14 w-14 flex-col items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(135deg,var(--c-bg-glass),var(--c-bg-base))] shadow-[0_12px_24px_-10px_rgb(11_13_18_/_1)] backdrop-blur-xl transition-all duration-300 group-hover:border-[var(--c-primary)] group-hover:scale-105 group-hover:shadow-[0_0_24px_-8px_rgb(99_102_241_/_0.8)]">
              <span className="mb-0.5 text-[9px] font-bold uppercase leading-none tracking-widest text-[var(--c-text-tertiary)] group-hover:text-[var(--c-text-secondary)]">
                Score
              </span>
              <span className="text-[18px] font-black leading-none text-[var(--c-primary)] drop-shadow-[0_0_8px_rgb(99_102_241_/_0.65)]">
                {score}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col gap-5 p-6 pt-2">
          {/* Title and Category */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--c-text-tertiary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-accent)] shadow-[0_0_8px_var(--c-accent)]" />
              {category}
            </span>
            <h3 className="line-clamp-2 text-[18px] font-bold leading-snug text-[var(--c-text-primary)] transition-colors group-hover:text-[var(--c-primary)]">
              {prospect.name}
            </h3>
          </div>

          {/* Details */}
          <div className="mt-auto flex flex-col gap-3.5 text-[13px] text-[var(--c-text-secondary)]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--c-text-disabled)] transition-colors group-hover:text-[var(--c-primary)]" />
              <span className="line-clamp-2 leading-relaxed">{getShortLocation(prospect)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-[var(--c-bg-subtle)] px-2.5 py-1">
                <Star className="h-3.5 w-3.5 fill-[var(--c-accent)] text-[var(--c-accent)] drop-shadow-[0_0_4px_var(--c-accent)]" />
                <span className="font-bold text-[var(--c-text-primary)]">{rating.toFixed(1)}</span>
                <span className="text-[11px] font-medium text-[var(--c-text-tertiary)]">
                  ({reviewsCount})
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex items-center justify-between border-t border-[var(--c-border-subtle)] pt-5 transition-all">
            <div className="flex gap-2.5">
              {prospect.website && (
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] text-[var(--c-text-secondary)] transition-all hover:-translate-y-0.5 hover:border-[var(--c-primary)] hover:bg-[var(--c-primary)] hover:text-white hover:shadow-[0_8px_16px_-6px_rgb(99_102_241_/_0.8)]"
                  title="Sitio Web"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="h-4 w-4" />
                </button>
              )}
              {prospect.phone && (
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] text-[var(--c-text-secondary)] transition-all hover:-translate-y-0.5 hover:border-[var(--c-secondary)] hover:bg-[var(--c-secondary)] hover:text-[var(--c-bg-base)] hover:shadow-[0_8px_16px_-6px_rgb(34_211_238_/_0.8)]"
                  title="Llamar"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-4 w-4" />
                </button>
              )}
            </div>

            {prospect.convertedToLeadId && (
              <Badge
                variant="success"
                className="border-[var(--c-secondary-border)] bg-[var(--c-secondary-subtle)] px-2.5 py-1 text-[10px] font-black tracking-widest text-[var(--c-secondary)] shadow-sm"
              >
                EN CRM
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
