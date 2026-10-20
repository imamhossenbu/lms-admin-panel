"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface DropdownSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export type DropdownSelectOptionInput = string | DropdownSelectOption;

export interface DropdownSelectProps {
  label?: string;
  fieldLabel?: string;
  placeholder?: string;
  options: DropdownSelectOptionInput[];
  value: string | null;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
  menuClassName?: string;
  disabled?: boolean;
}

export function DropdownSelect({
  label,
  fieldLabel,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  icon,
  className = "",
  align = "left",
  menuClassName = "",
  disabled = false,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Normalize options to DropdownSelectOption[]
  const normalizedOptions: DropdownSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? label;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {fieldLabel && (
        <label
          htmlFor={id}
          className="block body-sm-regular text-primary-400 mb-2 select-none"
        >
          {fieldLabel}
        </label>
      )}

      {/* Trigger Button styled matching agency's exact spec */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)",
        }}
        className={cn(
          "flex h-[40px] w-full items-center justify-between gap-2 rounded-[8px] border border-[#EDEDED] bg-white px-3.5 py-2 body-sm-regular leading-tight transition-all outline-none cursor-pointer select-none",
          "hover:border-[#D1D5DB] focus:border-[#1C4D8D]",
          open && "border-[#1C4D8D] ring-2 ring-[#1C4D8D]/10",
          disabled && "opacity-50 cursor-not-allowed",
          value ? "text-primary-500 font-medium" : "text-[#7F8482]"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          {icon && <span className="shrink-0 text-primary-300">{icon}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-primary-300 transition-transform duration-200 pointer-events-none",
            open && "rotate-180 text-primary-500"
          )}
        />
      </button>

      {/* Card System Popover Dropdown (Metabari Agency Elevated Card) */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              background: "#FFFFFF",
              border: "1px solid #EDEDED",
              boxShadow:
                "0px 10px 25px -5px rgba(14, 32, 56, 0.1), 0px 8px 10px -6px rgba(14, 32, 56, 0.05)",
            }}
            className={cn(
              "absolute z-50 mt-1.5 min-w-[200px] w-full rounded-[10px] p-1.5 bg-white max-h-64 overflow-y-auto scrollbar-none",
              alignClass,
              menuClassName
            )}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-[6px] px-3 py-2 text-left body-sm-regular transition-colors cursor-pointer flex items-center justify-between gap-2",
                    isSelected
                      ? "bg-[#F3F4F6] text-[#1C4D8D] font-semibold"
                      : "text-primary-500 hover:bg-[#F8F9FA]"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#1C4D8D] shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DropdownSelect;
