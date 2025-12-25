"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
      // Prevent iOS bounce
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content with scroll lock */}
      <div
        className={cn(
          "relative bg-background rounded-2xl border border-border/50 shadow-2xl",
          "max-w-6xl w-full mx-4 max-h-[90dvh]",
          "flex flex-col overflow-hidden",
          "bg-gradient-to-br from-background via-background to-muted/20",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
