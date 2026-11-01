import React from "react";
import type { LiveResourceType } from "@/types/liveClass";
import { cn } from "@/lib/cn";
import { RESOURCE_TYPE_META, TONE_TILE } from "./resourceMeta";

/** Rounded tinted icon tile for a resource type (red recording, blue document …). */
export function ResourceTypeTile({ type, size = "md" }: { type: LiveResourceType; size?: "sm" | "md" }) {
  const meta = RESOURCE_TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-lg", size === "sm" ? "h-9 w-9" : "h-10 w-10", TONE_TILE[meta.tone])}>
      <Icon className={size === "sm" ? "h-4.5 w-4.5" : "h-5 w-5"} />
    </span>
  );
}

export default ResourceTypeTile;
