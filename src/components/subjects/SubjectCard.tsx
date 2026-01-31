// src/components/subjects/SubjectCard.tsx
"use client";

import { Subject } from "@/lib/db/schema";
import Link from "next/link";
import { Copy, Check, Edit2, Trash2, Calendar, Hash, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export default function SubjectCard({
  subject,
  onDelete,
  canEdit,
  canDelete,
}: SubjectCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${subject.name}"? This action cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:via-red-600/2 group-hover:to-red-600/0 transition-all duration-500" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Header with title and badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-red-400 transition-colors duration-300">
                {subject.name}
              </h3>
              
              {/* Code badge */}
              <div className="relative">
                <button
                  onClick={() => handleCopy(subject.code, "code", "Subject code")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200 group/badge"
                >
                  <Hash className="h-3.5 w-3.5" />
                  <span className="text-sm font-mono font-medium tracking-tight">
                    {subject.code}
                  </span>
                  <Copy className="h-3 w-3 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                </button>
                {copiedField === "code" && (
                  <div className="absolute -top-1 -right-1">
                    <Check className="h-4 w-4 text-green-400 animate-in zoom-in duration-200" />
                  </div>
                )}
              </div>
              
              {/* Short tag badge */}
              <div className="relative">
                <button
                  onClick={() => handleCopy(subject.short_tag, "short_tag", "Short tag")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors duration-200 group/badge"
                >
                  <Tag className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">
                    {subject.short_tag}
                  </span>
                  <Copy className="h-3 w-3 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                </button>
                {copiedField === "short_tag" && (
                  <div className="absolute -top-1 -right-1">
                    <Check className="h-4 w-4 text-green-400 animate-in zoom-in duration-200" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {subject.description || "No description provided"}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {subject.category}
            </span>
            
            {subject.level && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                {subject.level.toLowerCase().replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Timestamps */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created {formatDate(subject.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated {formatDate(subject.updatedAt)}</span>
            </div>
            <div className="text-xs font-mono text-muted-foreground/60">
              ID: {subject.id.substring(0, 8)}...
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {(canEdit || canDelete) && (
          <div className="flex sm:flex-col gap-2">
            {canEdit && (
              <Link
                href={`/subjects/edit/${subject.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-3 sm:py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors duration-200 group/edit"
              >
                <Edit2 className="h-4 w-4" />
                <span className="sm:sr-only">Edit</span>
              </Link>
            )}
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-3 sm:py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 group/delete"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sm:sr-only">Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-500/10 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}