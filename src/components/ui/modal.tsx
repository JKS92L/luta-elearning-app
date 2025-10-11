"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-background rounded-2xl border border-border/50 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden",
          "bg-gradient-to-br from-background via-background to-muted/20",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-red-500/30 before:to-white/20 before:pointer-events-none",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
