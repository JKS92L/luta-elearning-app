// src/components/subjects/EnhancedSubjectList.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Subject } from "@/lib/db/schema";
import { useAuth } from "@/providers/auth-provider";
import { SubjectsGrid } from "./SubjectGrid";
import { SubjectsHeader } from "./SubjectHeader";
import { Pagination } from "./Pagination";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 12;

export function EnhancedSubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    category?: string;
    level?: string;
    hasDescription?: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isLoading: authLoading } = useAuth();

  // Define allowed roles
  const ALLOWED_ROLES = [
    "SYSTEM_ADMIN",
    "SYSTEM_SUPER_ADMIN",
    "SYSTEM_DEVELOPER",
    "TEACHER",
    "LECTURER",
    "CONTENT_CREATOR",
  ];

  const canEdit = user && user.role ? ALLOWED_ROLES.includes(user.role) : false;
  const canDelete = user && user.role ? ["SYSTEM_ADMIN", "SYSTEM_SUPER_ADMIN", "SYSTEM_DEVELOPER"].includes(user.role) : false;
  const canCreate = user && user.role ? ALLOWED_ROLES.includes(user.role) : false;

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subjects");
      
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchSubjects();
    }
  }, [authLoading, fetchSubjects]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete subject");
      }

      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete subject";
      toast.error(message);
    }
  };

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set(subjects.map(s => s.category));
    return Array.from(uniqueCategories).sort();
  }, [subjects]);

  // Filter subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          subject.name.toLowerCase().includes(searchLower) ||
          subject.code.toLowerCase().includes(searchLower) ||
          subject.short_tag.toLowerCase().includes(searchLower) ||
          subject.category.toLowerCase().includes(searchLower) ||
          (subject.description && subject.description.toLowerCase().includes(searchLower)) ||
          (subject.level && subject.level.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && subject.category !== filters.category) {
        return false;
      }

      // Level filter
      if (filters.level && subject.level !== filters.level) {
        return false;
      }

      // Description filter
      if (filters.hasDescription !== undefined) {
        if (filters.hasDescription && !subject.description) return false;
        if (!filters.hasDescription && subject.description) return false;
      }

      return true;
    });
  }, [subjects, searchTerm, filters]);

  // Paginate results
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SubjectsHeader
        title="Subjects"
        description="Browse and manage all educational subjects in the system"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        showCreateButton={canCreate}
        categories={categories}
      />

      {error && !loading && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchSubjects();
            }}
            className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      <SubjectsGrid
        subjects={paginatedSubjects}
        loading={loading}
        onDelete={handleDelete}
        canEdit={canEdit}
        canDelete={canDelete}
        canCreate={canCreate}
      />

      {/* Pagination and Stats */}
      {!loading && !error && filteredSubjects.length > 0 && (
        <div className="border-t border-border pt-6 mt-8 space-y-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSubjects.length)}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{filteredSubjects.length}</span>{" "}
              subjects
              {subjects.length !== filteredSubjects.length && (
                <span className="ml-2">
                  (filtered from {subjects.length} total)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear search
                </button>
              )}
              <button
                onClick={fetchSubjects}
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}