"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ checked, onChange, label, id, disabled, className }: ToggleSwitchProps) {
  return (
    <label htmlFor={id} className={cn("inline-flex items-center gap-3 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed",
          checked ? "bg-blue" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
      {label && <span className="body-sm-regular text-primary-500">{label}</span>}
    </label>
  );
}

export default ToggleSwitch;
