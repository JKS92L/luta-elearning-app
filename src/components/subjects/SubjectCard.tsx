// src/components/subjects/SubjectCard.tsx
"use client";

import { formatCurriculumType, getCurriculumTypeBadgeColor, getLevelDisplayName } from "@/lib/utils/subject-utils";
import { Subject } from "@/lib/db/schema";
import { Bookmark, GraduationCap, Layers, Hash, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function SubjectCard({
  subject,
  onDelete,
  canEdit = false,
  canDelete = false,
}: SubjectCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${subject.name}"? This action cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  return (
    <div 
      className="group relative border border-border rounded-xl p-5 
                 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 
                 transition-all duration-300 bg-card hover:bg-gradient-to-br 
                 hover:from-card hover:to-red-500/5 cursor-pointer
                 hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
      onClick={(e) => {
        // Only navigate if the click wasn't on the dropdown or its trigger
        if (!(e.target as HTMLElement).closest('.dropdown-trigger')) {
          window.location.href = `/subjects/${subject.id}`;
        }
      }}
    >
      {/* Soft Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 
                      opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
      
      {/* Card Header */}
      <div className="mb-4 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-foreground group-hover:text-red-400 transition-colors duration-300">
              {subject.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash className="h-3 w-3 flex-shrink-0" />
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded truncate max-w-[80px] transition-colors group-hover:bg-red-500/10">
                  {subject.code}
                </code>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded transition-colors group-hover:bg-red-500/10">
                  {subject.short_tag}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions Dropdown */}
          {(canEdit || canDelete) && (
            <div 
              className="dropdown-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(true);
              }}
            >
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 
                             transition-all duration-300 hover:bg-red-500/10 
                             hover:text-red-400 active:opacity-100 
                             focus:opacity-100 focus-within:opacity-100
                             sm:opacity-0 sm:group-hover:opacity-100
                             md:opacity-0 md:group-hover:opacity-100
                             lg:opacity-0 lg:group-hover:opacity-100"
                    onTouchStart={(e) => {
                      // Show dropdown on touch devices immediately
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 backdrop-blur-sm bg-card/95 border-border/50"
                  onInteractOutside={() => setIsDropdownOpen(false)}
                >
                  <Link href={`/subjects/${subject.id}`} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                  </Link>
                  {canEdit && (
                    <Link href={`/subjects/${subject.id}/edit`} onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Edit Subject</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 hover:text-red-300 
                                hover:bg-red-500/10 focus:text-red-300 focus:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                        setIsDropdownOpen(false);
                      }}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleDeleteClick();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete Subject</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 
                            group-hover:text-red-400 transition-colors duration-300" />
          <Badge 
            variant="outline" 
            className="text-xs font-normal truncate max-w-full 
                      group-hover:border-red-500/50 group-hover:text-red-400 
                      transition-colors duration-300"
          >
            {subject.category}
          </Badge>
        </div>
      </div>

      {/* Level and Curriculum Badges */}
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        {subject.level && (
          <Badge 
            variant="outline" 
            className="bg-blue-500/10 text-blue-400 border-blue-500/20 
                      flex items-center gap-1.5 text-xs group-hover:border-blue-400/50
                      transition-colors duration-300"
          >
            <GraduationCap className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{getLevelDisplayName(subject.level)}</span>
          </Badge>
        )}
        
        {subject.curriculum_type && (
          <Badge 
            variant="outline" 
            className={`${getCurriculumTypeBadgeColor(subject.curriculum_type)} 
                      flex items-center gap-1.5 text-xs group-hover:brightness-110
                      transition-all duration-300`}
          >
            <Bookmark className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{formatCurriculumType(subject.curriculum_type)}</span>
          </Badge>
        )}
      </div>

      {/* Footer with View Details */}
      <div className="pt-3 border-t border-border group-hover:border-red-500/30 
                      transition-colors duration-300 relative z-10">
        <Link
          href={`/subjects/${subject.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground 
                    hover:text-foreground group/view transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-1 bg-muted rounded group-hover/view:bg-red-500/10 
                        group-hover/view:scale-110 transition-all duration-300">
            <Eye className="h-3.5 w-3.5 transition-all duration-300 
                          group-hover/view:translate-x-0.5 group-hover/view:text-red-400" />
          </div>
          <span className="relative">
            View full details
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 
                            group-hover/view:w-full transition-all duration-300" />
          </span>
        </Link>
      </div>

      {/* Mobile touch indicator */}
      <div className="absolute bottom-4 right-4 sm:hidden">
        <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <MoreVertical className="h-3 w-3 text-red-400" />
        </div>
      </div>
    </div>
  );
}