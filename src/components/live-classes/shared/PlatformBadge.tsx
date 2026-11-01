import React from "react";
import { Link2, MonitorPlay, Users, Video } from "lucide-react";
import type { LivePlatform } from "@/types/liveClass";
import { cn } from "@/lib/cn";
import { LIVE_PLATFORM_LABEL } from "./liveClassView";

const ICON_TILE: Record<LivePlatform, { icon: React.ReactNode; tile: string }> = {
  ZOOM: { icon: <Video className="w-3.5 h-3.5" />, tile: "bg-blue text-white" },
  GOOGLE_MEET: { icon: <MonitorPlay className="w-3.5 h-3.5" />, tile: "bg-green-bg text-green" },
  TEAMS: { icon: <Users className="w-3.5 h-3.5" />, tile: "bg-purple-14 text-purple" },
  CUSTOM: { icon: <Link2 className="w-3.5 h-3.5" />, tile: "bg-gray-bg text-primary-400" },
};

/** Token-coloured platform tile (lucide icon). Re-used by the form's platform cards. */
export function PlatformIcon({ platform, size = "sm", className }: { platform: LivePlatform; size?: "sm" | "md"; className?: string }) {
  const view = ICON_TILE[platform];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        size === "sm" ? "w-6 h-6 rounded-md" : "w-9 h-9 rounded-lg",
        view.tile,
        className
      )}
    >
      {view.icon}
    </span>
  );
}

export interface PlatformBadgeProps {
  platform: LivePlatform;
  className?: string;
}

/** Icon tile + platform name ("Zoom", "Google Meet" …) on one line. */
export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap shrink-0", className)}>
      <PlatformIcon platform={platform} />
      <span className="body-sm-regular text-primary-500">{LIVE_PLATFORM_LABEL[platform]}</span>
    </span>
  );
}

export default PlatformBadge;
