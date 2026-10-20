"use client";

import React, { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="body-sm-regular mb-2 block text-primary-400">
      {children}
    </label>
  );
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  leftIcon?: ReactNode;
  placeholderValue?: string;
  containerClassName?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      error,
      options,
      value,
      onChange,
      leftIcon,
      placeholderValue = "",
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    const isPlaceholder = value === placeholderValue;

    return (
      <div className={containerClassName}>
        {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300 [&>svg]:h-4 [&>svg]:w-4">
              {leftIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => {
              if (!onChange) return;
              if ((props as any).name) {
                (onChange as any)(e);
              } else {
                (onChange as any)(e.target.value);
              }
            }}
            className={cn(
              "h-10 w-full cursor-pointer appearance-none rounded-[8px] border border-[#F0F0F0] bg-white pr-9 text-[13px] outline-none transition-colors focus:border-[#1C4D8D] [&>option]:text-[#0E2038]",
              leftIcon ? "pl-10" : "pl-3.5",
              isPlaceholder ? "text-[#969696]" : "text-primary-500",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.06)" }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
        </div>
        {error && <p className="body-xsm-regular text-red mt-1.5">{error}</p>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export default SelectField;
