"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { CommunityThread } from "@/types/community";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { ThreadActions } from "../hooks/useThreadActions";

export interface ModerationCardProps {
  thread: CommunityThread;
  actions: ThreadActions;
}

/** Quick moderation toggles: Pinned, Locked, Hidden from students (each → updateThread with toast). */
export function ModerationCard({ thread, actions }: ModerationCardProps) {
  const busy = actions.busy !== null;
  return (
    <IconSectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Moderation" description="Changes apply immediately." tone="orange">
      <div className="space-y-4">
        <SettingToggleRow
          title="Pinned"
          description="Keep this discussion at the top of the list."
          checked={thread.isPinned}
          disabled={busy}
          onChange={(v) => void actions.setFlag("isPinned", v)}
        />
        <SettingToggleRow
          title="Locked"
          description="Stop new replies. Existing replies stay visible."
          checked={thread.isLocked}
          disabled={busy}
          onChange={(v) => void actions.setFlag("isLocked", v)}
        />
        <SettingToggleRow
          title="Hidden from students"
          description="Only instructors and admins can see it."
          checked={thread.isHidden}
          disabled={busy}
          onChange={(v) => void actions.setFlag("isHidden", v)}
        />
      </div>
    </IconSectionCard>
  );
}

export default ModerationCard;
