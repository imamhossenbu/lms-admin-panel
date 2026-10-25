import React, { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface OutlineTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  /** Current length, shown with maxLength as a counter. */
  count?: number;
}

/** Labeled textarea with field-level error, matching InputField styling. */
export const OutlineTextArea = forwardRef<HTMLTextAreaElement, OutlineTextAreaProps>(
  ({ label, error, count, maxLength, id, className, ...props }, ref) => (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className="body-sm-regular text-primary-400 select-none">
          {label}
        </label>
        {maxLength !== undefined && count !== undefined && (
          <span className={cn("body-xsm-regular", count > maxLength ? "text-red" : "text-primary-300")}>
            {count}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        id={id}
        rows={3}
        className={cn(
          "w-full resize-none rounded-lg border px-3.5 py-2.5 body-sm-regular text-primary-500 outline-none transition-colors placeholder:text-primary-300 focus:border-brand-orange",
          error ? "border-red bg-red-14" : "border-dash bg-white",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
    </div>
  )
);

OutlineTextArea.displayName = "OutlineTextArea";
export default OutlineTextArea;
