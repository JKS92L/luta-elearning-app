// src/components/subjects/SubjectsHeader.tsx
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { FilterPanel } from "./FilterPanel";

interface SubjectsHeaderProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (filters: {
    category?: string;
    level?: string;
    curriculum_type?: string;
  }) => void;
  showSearch?: boolean;
  showCreateButton?: boolean;
  categories?: string[];
}

export function SubjectsHeader({
  title = "Subjects",
  description = "Manage all educational subjects in your system",
  searchTerm = "",
  onSearchChange,
  onFilterChange,
  showSearch = true,
  showCreateButton = true,
  categories = [],
}: SubjectsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-10 w-1 bg-gradient-to-b from-red-600 to-red-400 rounded-full" />
          <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-md text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {showSearch && onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects by name, code, or category..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background border-border focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {onFilterChange && (
            <FilterPanel 
              categories={categories} 
              onFilterChange={onFilterChange}
            />
          )}
          
          {showCreateButton && (
            <Link
              href="/subjects/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
            >
              <Plus className="h-5 w-5" />
              Create Subject
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}