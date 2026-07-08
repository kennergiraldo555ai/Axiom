import * as React from "react";
import { ProspectCard } from "./ProspectCard";
import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectTableProps {
  prospects: ProspectEntity[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (prospect: ProspectEntity) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  // These are kept to satisfy the interface contract but not used internally now
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
}

export function ProspectTable({
  prospects,
  isLoading,
  selectedId,
  onSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ProspectTableProps) {
  // The parent ProspectLayout now handles loading/empty states,
  // so this component only renders when there are prospects.

  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-12">
      {prospects.map((prospect) => (
        <ProspectCard
          key={prospect.id}
          prospect={prospect}
          isSelected={selectedId === prospect.id}
          onClick={onSelect}
        />
      ))}
      {/* Invisible element to trigger intersection observer for infinite loading */}
      <div ref={observerTarget} className="h-10 w-full col-span-full" />
      {hasMore && (
        <div className="flex justify-center py-4 col-span-full">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-[var(--c-text-tertiary)] text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-[var(--c-border-strong)] border-t-transparent animate-spin" />
              Cargando más resultados...
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </div>
  );
}
