"use client";

import React from "react";
import { Ban, Bell, ChevronDown, Copy, CopyPlus, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import type { LiveDisplayStatus } from "@/types/liveClass";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { canJoin } from "./liveDetailFormat";
import type { LiveClassActions } from "./hooks/useLiveClassActions";

export interface LiveClassMoreMenuProps {
  status: LiveDisplayStatus;
  actions: LiveClassActions;
}

/** Header "More ▾": copy link, duplicate, send reminder, cancel / restore, delete. */
export function LiveClassMoreMenu({ status, actions }: LiveClassMoreMenuProps) {
  const isCancelled = status === "CANCELLED";
  const busy = actions.busy !== null;
  return (
    <AppDropdownMenu
      items={[
        { key: "copy", label: "Copy Meeting Link", icon: <Copy className="h-4 w-4" />, onClick: () => void actions.copyLink(), disabled: isCancelled },
        { key: "duplicate", label: "Duplicate", icon: <CopyPlus className="h-4 w-4" />, onClick: () => void actions.duplicate(), disabled: busy },
        { key: "remind", label: "Send Reminder", icon: <Bell className="h-4 w-4" />, onClick: () => void actions.remind(false), disabled: busy || !canJoin(status) },
        isCancelled
          ? { key: "restore", label: "Restore Class", icon: <RotateCcw className="h-4 w-4" />, onClick: () => actions.openConfirm("restore"), separatorBefore: true }
          : {
              key: "cancel",
              label: "Cancel Class",
              icon: <Ban className="h-4 w-4" />,
              onClick: () => actions.openConfirm("cancel"),
              disabled: status === "COMPLETED",
              danger: true,
              separatorBefore: true,
            },
        { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => actions.openConfirm("delete"), danger: true },
      ]}
      trigger={
        <SecondaryButton leftIcon={<MoreHorizontal />} rightIcon={<ChevronDown />}>
          More
        </SecondaryButton>
      }
    />
  );
}

export default LiveClassMoreMenu;
