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
  "USD Funding": { bg: "bg-green-bg", text: "text-green" },
  "Meta Invoice": { bg: "bg-blue-14", text: "text-blue" },
  "Refund": { bg: "bg-purple-14", text: "text-purple" },
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
    bg: "bg-gray-bg",
    text: "text-primary-500",
  };

  const finalBg = bgColor || defaultStyle.bg;
  const finalTextColor = textColor || defaultStyle.text;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 body-xsm-medium whitespace-nowrap shrink-0",
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
