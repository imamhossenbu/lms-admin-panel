"use client";

import React from "react";
import { Ban, MoreHorizontal, Trash2 } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { AppDropdownMenu, type DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { canCancelBroadcast, canDeleteBroadcast } from "./broadcastFormat";

export interface BroadcastMoreMenuProps {
  broadcast: Broadcast;
  disabled?: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

/** Header "⋮" menu: Cancel (scheduled) / Delete (draft, cancelled). Renders nothing when no action applies. */
export function BroadcastMoreMenu({ broadcast, disabled, onCancel, onDelete }: BroadcastMoreMenuProps) {
  const items: DropdownActionItem[] = [];
  if (canCancelBroadcast(broadcast)) items.push({ key: "cancel", label: "Cancel broadcast", icon: <Ban className="h-4 w-4" />, danger: true, disabled, onClick: onCancel });
  if (canDeleteBroadcast(broadcast)) items.push({ key: "delete", label: "Delete broadcast", icon: <Trash2 className="h-4 w-4" />, danger: true, disabled, onClick: onDelete });
  if (!items.length) return null;
  return <AppDropdownMenu align="end" items={items} trigger={<SecondaryButton icon={<MoreHorizontal />} aria-label="More broadcast actions" title="More actions" />} />;
}

export default BroadcastMoreMenu;
