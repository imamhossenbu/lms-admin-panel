"use client";

import React from "react";
import { ChevronDown, Copy, EyeOff, MoreVertical, Send, Trash2 } from "lucide-react";
import type { AssignmentStatus } from "@/types/assignment";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface AssignmentMoreMenuProps {
  status: AssignmentStatus;
  disabled?: boolean;
  onDuplicate: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}

/** Header "More ▾" menu: Duplicate, Publish/Unpublish, Delete. */
export function AssignmentMoreMenu({ status, disabled, onDuplicate, onTogglePublish, onDelete }: AssignmentMoreMenuProps) {
  const isPublished = status === "PUBLISHED";
  return (
    <AppDropdownMenu
      items={[
        { key: "duplicate", label: "Duplicate", icon: <Copy className="h-4 w-4" />, onClick: onDuplicate, disabled },
        {
          key: "publish",
          label: isPublished ? "Unpublish" : "Publish",
          icon: isPublished ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />,
          onClick: onTogglePublish,
          disabled,
        },
        { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: onDelete, danger: true, separatorBefore: true },
      ]}
      trigger={
        <SecondaryButton leftIcon={<MoreVertical />} rightIcon={<ChevronDown />} className="text-blue!">
          More
        </SecondaryButton>
      }
    />
  );
}

export default AssignmentMoreMenu;
