// src/components/subjects/EmptyState.tsx
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  canCreate?: boolean;
}

export function EmptyState({ canCreate = false }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 mb-4">
        <BookOpen className="h-8 w-8 text-red-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No subjects found
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Start by creating your first subject to organize courses and resources.
      </p>
      
      {canCreate && (
        <Link
          href="/subjects/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
        >
          <Plus className="h-5 w-5" />
          Create Subject
        </Link>
      )}
    </div>
  );
}