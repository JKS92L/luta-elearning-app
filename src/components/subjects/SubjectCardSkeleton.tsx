// src/components/subjects/SubjectCardSkeleton.tsx
export function SubjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-7 w-48 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-24 bg-muted rounded-full" />
            </div>
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>

          {/* Badges skeleton */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>

          {/* Timestamps skeleton */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex sm:flex-col gap-2">
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}