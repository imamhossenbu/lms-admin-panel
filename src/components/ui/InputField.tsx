import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, id, ...props },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="body-sm-medium text-brand-navy">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-10 px-3 rounded-lg border border-dash bg-white text-brand-navy body-sm-regular transition-all",
              "focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-primary",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-500 focus:ring-rose-200 focus:border-rose-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-muted">{rightIcon}</span>
          )}
        </div>
        {error ? (
          <span className="body-xsm-regular text-rose-500">{error}</span>
        ) : hint ? (
          <span className="body-xsm-regular text-muted">{hint}</span>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
