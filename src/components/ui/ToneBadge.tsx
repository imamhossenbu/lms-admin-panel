import React from "react";
import { cn } from "@/lib/cn";

export type Tone =
  | "green"
  | "blue"
  | "red"
  | "orange"
  | "gray"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "ice"
  | "navy"
  | "indigo"
  | "purple";

const TONE_CLASS: Record<string, string> = {
  green: "bg-green-bg text-green",
  success: "bg-green-bg text-green",
  blue: "bg-blue-14 text-blue",
  primary: "bg-[#EBF4FC] text-[#1C4D8D]",
  red: "bg-red-14 text-red",
  danger: "bg-red-14 text-red",
  orange: "bg-[#FFF7ED] text-[#EA580C]",
  warning: "bg-[#FFFBEB] text-[#D97706]",
  gray: "bg-[#F0F1F3] text-primary-300",
  neutral: "bg-[#F0F1F3] text-primary-300",
  ice: "bg-[#EBF4FC] text-[#1C4D8D]",
  navy: "bg-[#0E203814] text-[#0E2038]",
  indigo: "bg-[#EEF2FF] text-[#4F46E5]",
  purple: "bg-[#F5F3FF] text-[#7C3AED]",
};

const SIZE_CLASS: Record<string, string> = {
  sm: "px-2 py-0.5",
  md: "px-2.5 py-1",
  lg: "px-3 py-1.5",
};

export interface ToneBadgeProps {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ToneBadge({ tone, children, className, size = "md" }: ToneBadgeProps) {
  return (
    <span
      className={cn(
        "body-xsm-medium inline-flex items-center whitespace-nowrap rounded-[6px] transition-colors",
        SIZE_CLASS[size] || SIZE_CLASS.md,
        TONE_CLASS[tone] || TONE_CLASS.gray,
        className
      )}
    >
      {children}
    </span>
  );
}

export default ToneBadge;
