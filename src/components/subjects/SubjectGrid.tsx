// src/components/subjects/SubjectsGrid.tsx (Updated)
import { Subject } from "@/lib/db/schema";
import SubjectCard from "./SubjectCard";
import { SubjectCardSkeleton } from "./SubjectCardSkeleton";
import { EmptyState } from "./EmptyState";

interface SubjectsGridProps {
  subjects: Subject[];
  loading?: boolean;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

export function SubjectsGrid({
  subjects,
  loading = false,
  onDelete,
  canEdit = false,
  canDelete = false,
  canCreate = false,
}: SubjectsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SubjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (subjects.length === 0) {
    return <EmptyState canCreate={canCreate} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}