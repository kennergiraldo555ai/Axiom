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

export function ProspectCard({ prospect, isSelected, onClick }: ProspectCardProps) {
  const rating = prospect.rating || 0;
  const reviewsCount = prospect.userRatingsCount || 0;
  const hasAnalysis = prospect.analysisStatus === "COMPLETED";
  const score = prospect.qualityScore || 0;

  // Derive a placeholder image based on category or name length
  const category = getCategoryLabel(prospect);
  const coverImage = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60`;

  return (
    <div
      onClick={() => onClick(prospect)}
      className={`relative cursor-pointer group transition-all duration-500 ease-out flex flex-col h-full bg-[var(--c-bg-elevated)] border rounded-[var(--r-2xl)] overflow-hidden hover:-translate-y-2 ${
        isSelected
          ? "border-[var(--c-accent)] shadow-[0_10px_40px_-10px_rgba(0,229,255,0.4)] ring-1 ring-[var(--c-accent)]"
          : "border-[var(--c-border-strong)] shadow-tactile hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,1)] hover:border-[var(--c-border-hover)]"
      }`}
    >
      {/* Cover Image Section */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-[var(--c-bg-subtle)]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-transparent z-10 opacity-90" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={prospect.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 mix-blend-overlay"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {hasAnalysis && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--c-bg-elevated)]/80 backdrop-blur-md border border-[var(--c-accent)]/30 text-[10px] font-bold text-[var(--c-accent)] uppercase tracking-wider shadow-[0_0_10px_rgba(0,229,255,0.3)]">
              <Sparkles className="w-3 h-3" />
              IA Analyzed
            </div>
          )}
        </div>

        {/* Score Badge */}
        {score > 0 && (
          <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--c-bg-elevated)] to-[#0B0D12] border border-[var(--c-border-strong)] flex flex-col items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)] backdrop-blur-xl group-hover:border-[var(--c-accent)] transition-colors">
            <span className="text-[9px] text-[var(--c-text-tertiary)] font-bold uppercase tracking-wider leading-none mb-0.5">
              Score
            </span>
            <span className="text-[16px] font-black text-[var(--c-accent)] leading-none drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
              {score}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative flex-1 p-5 pt-4 flex flex-col gap-4 bg-gradient-to-b from-[#0B0D12] to-[var(--c-bg-elevated)]">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[16px] leading-tight text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)] transition-colors line-clamp-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
              {prospect.name}
            </h3>
            <span className="text-[11px] font-bold tracking-[0.1em] text-[var(--c-text-tertiary)] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-violet)] shadow-[0_0_5px_var(--c-violet)]" />
              {category}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col gap-3 text-[13px] text-[var(--c-text-secondary)] mt-auto">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[var(--c-text-disabled)] shrink-0" />
            <span className="truncate">{getShortLocation(prospect)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[var(--c-warning)] fill-[var(--c-warning)] drop-shadow-[0_0_5px_rgba(255,234,0,0.5)]" />
              <span className="font-bold text-[var(--c-text-primary)]">{rating.toFixed(1)}</span>
              <span className="text-[var(--c-text-tertiary)] text-[11px]">({reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="mt-4 pt-4 border-t border-[var(--c-border-strong)] flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {prospect.website && (
              <button
                className="w-8 h-8 rounded-full bg-[var(--c-bg-hover)] border border-[var(--c-border-strong)] flex items-center justify-center hover:bg-[var(--c-accent)] hover:border-[var(--c-accent)] hover:text-[#0B0D12] transition-all"
                title="Website"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
            )}
            {prospect.phone && (
              <button
                className="w-8 h-8 rounded-full bg-[var(--c-bg-hover)] border border-[var(--c-border-strong)] flex items-center justify-center hover:bg-[var(--c-success)] hover:border-[var(--c-success)] hover:text-[#0B0D12] transition-all"
                title="Teléfono"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {prospect.convertedToLeadId && (
            <Badge
              variant="success"
              className="bg-[#00e676]/10 text-[#00e676] border-[#00e676]/30 text-[10px] font-bold px-2 py-0.5 tracking-widest"
            >
              EN CRM
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
