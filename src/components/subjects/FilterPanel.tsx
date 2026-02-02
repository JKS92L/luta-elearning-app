// src/components/subjects/FilterPanel.tsx
"use client";

import { LevelType, CurriculumType } from "@/lib/db/schema";
import { Filter, X, Bookmark } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  categories: string[];
  onFilterChange: (filters: {
    category?: string;
    level?: string;
    curriculum_type?: string;
  }) => void;
}

// Helper function to format curriculum type for display (same as above)
const formatCurriculumType = (curriculumType: string) => {
  const displayNames: Record<string, string> = {
    "COMPETENCE_BASED_OUTCOME": "Competence Based Outcome",
    "OBJECTIVE_BASED_OUTCOME": "Objective Based Outcome",
  };
  
  return displayNames[curriculumType] || curriculumType;
};

export function FilterPanel({ categories, onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    curriculum_type: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    onFilterChange({
      category: newFilters.category || undefined,
      level: newFilters.level || undefined,
      curriculum_type: newFilters.curriculum_type || undefined,
    });
  };

  const clearFilters = () => {
    setFilters({ category: "", level: "", curriculum_type: "" });
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors duration-200 relative"
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filter Subjects</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange("level", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="">All Levels</option>
                    {Object.entries(LevelType).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Curriculum Type Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Curriculum Type
                  </label>
                  <select
                    value={filters.curriculum_type}
                    onChange={(e) => handleFilterChange("curriculum_type", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="">All Curriculum Types</option>
                    <option value="has_curriculum">Has Curriculum Type</option>
                    <option value="no_curriculum">No Curriculum Type</option>
                    <optgroup label="Specific Types">
                      {Object.entries(CurriculumType).map(([key, value]) => (
                        <option key={key} value={value}>
                          {formatCurriculumType(value)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-4 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}