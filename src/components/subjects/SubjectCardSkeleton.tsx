// src/components/subjects/SubjectCardSkeleton.tsx
export function SubjectCardSkeleton() {
  return (
    <div className="border border-border rounded-xl p-5 bg-card animate-pulse">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="flex items-center gap-2">
              <div className="h-3 bg-muted rounded w-16" />
              <div className="h-3 bg-muted rounded w-12" />
            </div>
          </div>
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3.5 w-3.5 bg-muted rounded" />
          <div className="h-6 bg-muted rounded w-20" />
        </div>
      </div>

      {/* Level and Curriculum Badges Skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-muted rounded w-16" />
        <div className="h-6 bg-muted rounded w-24" />
      </div>

      {/* Footer Skeleton */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}