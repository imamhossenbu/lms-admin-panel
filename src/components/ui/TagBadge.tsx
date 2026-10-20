"use client";

import React from "react";
import { cn } from "@/lib/cn";

export type TagType = string;

export interface TagBadgeProps {
  tag?: TagType;
  children?: React.ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
  showDot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
}

const DEFAULT_TAG_STYLES: Record<string, { bg: string; text: string }> = {
  "USD Funding": { bg: "bg-[#E6F4EA]", text: "text-[#137333]" },
  "Meta Invoice": { bg: "bg-[#E8F0FE]", text: "text-[#1A73E8]" },
  "Refund": { bg: "bg-[#FCE8F3]", text: "text-[#C51162]" },
};

export function TagBadge({
  tag = "",
  children,
  className,
  bgColor,
  textColor,
  showDot = false,
  dotColor,
  icon,
}: TagBadgeProps) {
  const defaultStyle = (tag && DEFAULT_TAG_STYLES[tag]) || {
    bg: "bg-[#F3F4F6]",
    text: "text-primary-500",
  };

  const finalBg = bgColor || defaultStyle.bg;
  const finalTextColor = textColor || defaultStyle.text;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 body-xsm-medium whitespace-nowrap",
        finalBg,
        finalTextColor,
        className
      )}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center">
          {icon}
        </span>
      )}
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColor || finalTextColor.replace("text-", "bg-")
          )}
        />
      )}
      {children || tag}
    </span>
  );
}

export default TagBadge;
