"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { Link2, MonitorPlay, SquarePlay, Upload } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LessonVideoSource } from "@/validations/lessonFormSchema";

const SOURCE_TABS: { value: LessonVideoSource; label: string; icon: React.ElementType }[] = [
  { value: "UPLOAD", label: "Upload Video", icon: Upload },
  { value: "YOUTUBE", label: "YouTube", icon: SquarePlay },
  { value: "VIMEO", label: "Vimeo", icon: MonitorPlay },
  { value: "LINK", label: "External Link", icon: Link2 },
];

interface VideoSourceTabsProps {
  value: LessonVideoSource;
  onChange: (source: LessonVideoSource) => void;
  disabled?: boolean;
}

/** Upload Video | YouTube | Vimeo | External Link — joined tabs with an animated active fill. */
export function VideoSourceTabs({ value, onChange, disabled }: VideoSourceTabsProps) {
  const layoutId = useId();

  return (
    <div
      role="tablist"
      aria-label="Video source"
      className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-dash bg-white overflow-hidden divide-x divide-dash"
    >
      {SOURCE_TABS.map(({ value: tab, label, icon: Icon }) => {
        const isActive = tab === value;
        return (
          <motion.button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled && !isActive}
            onClick={() => !isActive && onChange(tab)}
            whileTap={disabled ? undefined : { scale: 0.97 }}
            className={cn(
              "relative h-11 px-3 inline-flex items-center justify-center gap-2 body-sm-medium whitespace-nowrap transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              isActive ? "text-brand-orange" : "text-primary-400 hover:text-primary-500 hover:bg-slate-50"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`video-source-${layoutId}`}
                className="absolute inset-0 bg-brand-orange-light border-b-2 border-brand-orange"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <Icon className="relative z-10 w-4 h-4 shrink-0" />
            <span className="relative z-10">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default VideoSourceTabs;
