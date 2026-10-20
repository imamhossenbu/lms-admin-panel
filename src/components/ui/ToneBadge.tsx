import React from "react";
import { cn } from "@/lib/cn";

export interface ToneBadgeProps {
  children: React.ReactNode;
  tone?: "primary" | "navy" | "ice" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function ToneBadge({
  children,
  tone = "primary",
  size = "md",
  className,
}: ToneBadgeProps) {
  const toneStyles = {
    primary: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
    navy: "bg-brand-navy/10 text-brand-navy border border-brand-navy/20",
    ice: "bg-[#BDE8F5]/40 text-[#0F2854] border border-[#BDE8F5]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 body-xsm-medium rounded-full",
    md: "px-2.5 py-1 body-xsm-medium rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        toneStyles[tone],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
