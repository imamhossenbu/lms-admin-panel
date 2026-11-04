"use client";

import React from "react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CATEGORY_ICON_BY_ID } from "./categoryIcons";

interface CategoryIconRendererProps {
  /** A CATEGORY_ICONS id, or a legacy emoji / image URL saved by older screens. */
  iconId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: { box: "w-7 h-7 rounded-lg body-xsm-regular", icon: "w-3.5 h-3.5" },
  md: { box: "w-8 h-8 rounded-lg body-sm-regular", icon: "w-4 h-4" },
  lg: { box: "w-10 h-10 rounded-xl body-regular", icon: "w-5 h-5" },
};

export function CategoryIconRenderer({ iconId, size = "md", className = "" }: CategoryIconRendererProps) {
  const config = CATEGORY_ICON_BY_ID[iconId];
  if (!config) return <CategoryIcon icon={iconId} className={`${SIZE[size].box} ${className}`} />;
  const Icon = config.icon;
  return (
    <div className={`${SIZE[size].box} ${config.bg} ${config.text} flex items-center justify-center shrink-0 ${className}`}>
      <Icon className={SIZE[size].icon} />
    </div>
  );
}

export default CategoryIconRenderer;
