"use client";

import React from "react";
import {
  Code2,
  Palette,
  Megaphone,
  Briefcase,
  Camera,
  BarChart2,
  Globe,
  Heart,
  Music,
  LayoutGrid,
} from "lucide-react";

interface CategoryIconRendererProps {
  iconId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ICON_MAP = {
  code: { icon: Code2, bg: "bg-purple-14", text: "text-purple" },
  design: { icon: Palette, bg: "bg-red-14", text: "text-red" },
  marketing: { icon: Megaphone, bg: "bg-brand-orange-light", text: "text-brand-orange" },
  business: { icon: Briefcase, bg: "bg-green-bg", text: "text-green" },
  photography: { icon: Camera, bg: "bg-yellow-bg", text: "text-yellow" },
  "data-science": { icon: BarChart2, bg: "bg-blue-14", text: "text-blue" },
  language: { icon: Globe, bg: "bg-blue-14", text: "text-blue" },
  health: { icon: Heart, bg: "bg-green-bg", text: "text-green" },
  music: { icon: Music, bg: "bg-red-14", text: "text-red" },
  other: { icon: LayoutGrid, bg: "bg-blue-14", text: "text-blue" },
};

export function CategoryIconRenderer({
  iconId,
  size = "md",
  className = "",
}: CategoryIconRendererProps) {
  const config = ICON_MAP[iconId as keyof typeof ICON_MAP] || ICON_MAP.code;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg body-xsm-regular",
    md: "w-8 h-8 rounded-lg body-sm-regular",
    lg: "w-10 h-10 rounded-xl body-regular",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${config.bg} ${config.text} flex items-center justify-center shrink-0 ${className}`}
    >
      <IconComponent className={iconSizes[size]} />
    </div>
  );
}
