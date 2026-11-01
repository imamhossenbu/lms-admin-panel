"use client";

import React from "react";
import { Link2, MonitorPlay, SquarePlay, Upload } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
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

/** Upload Video | YouTube | Vimeo | External Link — the shared capsule PillTabs, full width. */
export function VideoSourceTabs({ value, onChange, disabled }: VideoSourceTabsProps) {
  return (
    <PillTabs
      fullWidth
      ariaLabel="Video source"
      activeId={value}
      onChange={onChange}
      tabs={SOURCE_TABS.map(({ value: id, label, icon: Icon }) => ({ id, label, icon: <Icon />, disabled: disabled && id !== value }))}
    />
  );
}

export default VideoSourceTabs;
