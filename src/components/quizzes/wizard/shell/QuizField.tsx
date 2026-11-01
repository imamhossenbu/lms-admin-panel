import React from "react";
import { cn } from "@/lib/cn";

export interface QuizFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Muted "(Optional)" suffix. */
  optional?: boolean;
  error?: string;
  /** Helper line under the control (hidden while an error shows). */
  helper?: React.ReactNode;
  /** Right side of the helper row (e.g. a CharCounter). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Label (+ required star / optional suffix) → control → error or helper (+ counter). */
export function QuizField({ label, htmlFor, required, optional, error, helper, aside, children, className }: QuizFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-2 block select-none body-sm-medium text-primary-500">
        {label}
        {required && <span className="ml-0.5 text-red">*</span>}
        {optional && <span className="ml-1 body-sm-regular text-primary-300">(Optional)</span>}
      </label>
      {children}
      {(error || helper || aside) && (
        <div className="mt-1.5 flex items-start justify-between gap-3">
          {error ? (
            <p role="alert" className="body-xsm-regular text-red">
              {error}
            </p>
          ) : (
            <p className="body-xsm-regular text-primary-300">{helper}</p>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}

export default QuizField;
