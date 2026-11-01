import React from "react";
import { cn } from "@/lib/cn";

export interface WizardFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Adds a muted "(Optional)" suffix. */
  optional?: boolean;
  error?: string;
  /** Right side of the label row (e.g. a counter). */
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Label (+ required star / optional suffix) → control → field-level error message. */
export function WizardField({ label, htmlFor, required, optional, error, hint, children, className }: WizardFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="body-sm-medium text-primary-500 select-none">
          {label}
          {required && <span className="ml-0.5 text-red">*</span>}
          {optional && <span className="ml-1 body-sm-regular text-primary-300">(Optional)</span>}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 body-xsm-regular text-red">
          {error}
        </p>
      )}
    </div>
  );
}

export default WizardField;
