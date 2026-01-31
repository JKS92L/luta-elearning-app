// src/components/ui/form-field.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  helpText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText && !error && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {helpText}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <Info className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage > 80;
  const isError = percentage >= 100;

  return (
    <div className="text-xs text-muted-foreground flex items-center gap-1">
      <span className={cn(isError ? "text-red-400" : isWarning ? "text-amber-400" : "")}>
        {current}/{max}
      </span>
    </div>
  );
}