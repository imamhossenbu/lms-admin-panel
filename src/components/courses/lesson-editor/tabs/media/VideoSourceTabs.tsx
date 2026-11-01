"use client";

import React from "react";
import { FolderOpen, Link2, SquarePlay, Upload, type LucideIcon } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import { EDITOR_VIDEO_SOURCES } from "@/validations/lessonEditorSchema";
import type { VideoSource } from "./videoUtils";

/** Vimeo has no lucide icon — a small "V" glyph keeps the row consistent. */
function VimeoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 7.4c-.1 2-1.5 4.7-4.2 8.1C15 19.1 12.6 21 10.6 21c-1.2 0-2.3-1.1-3.1-3.4L5.8 11.4C5.2 9.1 4.6 8 3.9 8c-.1 0-.7.3-1.6 1L1.3 7.7l3-2.6C5.6 3.9 6.6 3.3 7.3 3.2c1.6-.2 2.5.9 2.9 3.2.4 2.5.7 4.1.8 4.7.5 2.1 1 3.1 1.5 3.1.4 0 1.1-.7 1.9-2 .9-1.4 1.3-2.4 1.4-3.1.1-1.2-.3-1.8-1.4-1.8-.5 0-1 .1-1.5.3 1-3.3 2.9-4.9 5.7-4.8 2.1.1 3.1 1.4 2.9 4z" />
    </svg>
  );
}

const SOURCE_META: Record<VideoSource, { label: string; icon: LucideIcon | typeof VimeoGlyph }> = {
  UPLOAD: { label: "Upload Video", icon: Upload },
  YOUTUBE: { label: "YouTube", icon: SquarePlay },
  VIMEO: { label: "Vimeo", icon: VimeoGlyph },
  LINK: { label: "External Link", icon: Link2 },
  LIBRARY: { label: "Choose from Library", icon: FolderOpen },
};

export interface VideoSourceTabsProps {
  value: VideoSource;
  onChange: (source: VideoSource) => void;
}

/** Source picker of the Lesson Video card — the shared capsule PillTabs, full width. */
export function VideoSourceTabs({ value, onChange }: VideoSourceTabsProps) {
  return (
    <PillTabs
      fullWidth
      ariaLabel="Video source"
      activeId={value}
      onChange={onChange}
      tabs={EDITOR_VIDEO_SOURCES.map((id) => {
        const { label, icon: Icon } = SOURCE_META[id];
        return { id, label, icon: <Icon /> };
      })}
    />
  );
}

export default VideoSourceTabs;
