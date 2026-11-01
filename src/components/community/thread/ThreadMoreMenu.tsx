"use client";

import React from "react";
import { Eye, EyeOff, Link2, MoreVertical, Trash2 } from "lucide-react";
import type { CommunityThread } from "@/types/community";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { ThreadActions } from "./hooks/useThreadActions";

export interface ThreadMoreMenuProps {
  thread: CommunityThread;
  actions: ThreadActions;
}

/** Header ⋮ menu: Hide / Unhide from students, Copy link, Delete. */
export function ThreadMoreMenu({ thread, actions }: ThreadMoreMenuProps) {
  return (
    <AppDropdownMenu
      items={[
        thread.isHidden
          ? { key: "unhide", label: "Unhide from Students", icon: <Eye className="h-4 w-4" />, onClick: () => void actions.toggleHidden(), disabled: actions.busy !== null }
          : { key: "hide", label: "Hide from Students", icon: <EyeOff className="h-4 w-4" />, onClick: () => void actions.toggleHidden(), disabled: actions.busy !== null },
        { key: "copy", label: "Copy Link", icon: <Link2 className="h-4 w-4" />, onClick: () => void actions.copyLink() },
        { key: "delete", label: "Delete Discussion", icon: <Trash2 className="h-4 w-4" />, onClick: actions.openDelete, danger: true, separatorBefore: true },
      ]}
      trigger={<SecondaryButton aria-label="More actions" title="More actions" leftIcon={<MoreVertical />} className="px-2.5" />}
    />
  );
}

export default ThreadMoreMenu;
