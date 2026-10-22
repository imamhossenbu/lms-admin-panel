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
  code: { icon: Code2, bg: "bg-purple-50", text: "text-purple-600" },
  design: { icon: Palette, bg: "bg-rose-50", text: "text-rose-600" },
  marketing: { icon: Megaphone, bg: "bg-orange-50", text: "text-[#FF5B00]" },
  business: { icon: Briefcase, bg: "bg-emerald-50", text: "text-emerald-600" },
  photography: { icon: Camera, bg: "bg-amber-50", text: "text-amber-600" },
  "data-science": { icon: BarChart2, bg: "bg-blue-50", text: "text-blue-600" },
  language: { icon: Globe, bg: "bg-indigo-50", text: "text-indigo-600" },
  health: { icon: Heart, bg: "bg-green-bg", text: "text-green" },
  music: { icon: Music, bg: "bg-pink-50", text: "text-pink-600" },
  other: { icon: LayoutGrid, bg: "bg-sky-50", text: "text-sky-600" },
};

export function CategoryIconRenderer({
  iconId,
  size = "md",
  className = "",
}: CategoryIconRendererProps) {
  const config = ICON_MAP[iconId as keyof typeof ICON_MAP] || ICON_MAP.code;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg text-xs",
    md: "w-8 h-8 rounded-lg text-sm",
    lg: "w-10 h-10 rounded-xl text-base",
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
