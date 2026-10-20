import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, hint, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="body-sm-medium text-brand-navy">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full h-10 px-3 rounded-lg border border-dash bg-white text-brand-navy body-sm-regular transition-all",
            "focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-primary",
            error && "border-rose-500 focus:ring-rose-200",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="body-xsm-regular text-rose-500">{error}</span>
        ) : hint ? (
          <span className="body-xsm-regular text-muted">{hint}</span>
        ) : null}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
