"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AppSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AppSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: (string | AppSelectOption)[];
  placeholder?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  icon,
  size = "md",
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}: AppSelectProps) {
  const normalizedOptions: AppSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const sizeClasses =
    size === "sm"
      ? "h-8 px-2.5 text-xs gap-1.5"
      : "h-9 px-3 text-sm gap-2";

  return (
    <div className={cn("relative inline-block", className)}>
      <Select.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger
          className={cn(
            "inline-flex items-center justify-between rounded-lg border border-dash bg-[#F8FAFC] text-primary-500 font-medium hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs whitespace-nowrap",
            sizeClasses,
            triggerClassName
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {icon && <span className="shrink-0 text-primary-400">{icon}</span>}
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            <Select.Value placeholder={placeholder}>
              {selectedOption ? selectedOption.label : placeholder}
            </Select.Value>
          </div>
          <Select.Icon asChild>
            <ChevronDown className="w-3.5 h-3.5 text-primary-300 ml-1.5 shrink-0" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-dash bg-white p-1 text-primary-500 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              contentClassName
            )}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-primary-400 cursor-default">
              <ChevronUp className="w-3.5 h-3.5" />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {normalizedOptions.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex items-center justify-between select-none py-1.5 px-2.5 rounded-lg text-xs font-medium text-primary-400 hover:text-primary-500 hover:bg-[#F8FAFC] focus:bg-[#EFF6FF] focus:text-[#1D4ED8] focus:outline-none cursor-pointer transition-colors data-[state=checked]:bg-[#EFF6FF] data-[state=checked]:text-[#1D4ED8] data-[state=checked]:font-semibold"
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <Select.ItemText>{opt.label}</Select.ItemText>
                  </div>
                  <Select.ItemIndicator className="ml-2 shrink-0 text-[#1D4ED8]">
                    <Check className="w-3.5 h-3.5" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-primary-400 cursor-default">
              <ChevronDown className="w-3.5 h-3.5" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
