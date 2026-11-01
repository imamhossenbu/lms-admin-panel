"use client";

import React from "react";
import { Archive, Eye, EyeOff, MoreHorizontal, Send, Trash2 } from "lucide-react";
import type { QuizStatus } from "@/types/quiz";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface QuizMoreMenuProps {
  status: QuizStatus;
  disabled?: boolean;
  onPreview: () => void;
  onTogglePublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

/** Header "⋮" menu: Preview Quiz, Publish/Unpublish, Archive, Delete. */
export function QuizMoreMenu({ status, disabled, onPreview, onTogglePublish, onArchive, onDelete }: QuizMoreMenuProps) {
  const isPublished = status === "PUBLISHED";
  return (
    <AppDropdownMenu
      align="end"
      items={[
        { key: "preview", label: "Preview Quiz", icon: <Eye className="h-4 w-4" />, onClick: onPreview },
        {
          key: "publish",
          label: isPublished ? "Unpublish" : "Publish",
          icon: isPublished ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />,
          onClick: onTogglePublish,
          disabled,
        },
        ...(status !== "ARCHIVED" ? [{ key: "archive", label: "Archive", icon: <Archive className="h-4 w-4" />, onClick: onArchive, disabled }] : []),
        { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: onDelete, danger: true, separatorBefore: true },
      ]}
      trigger={<SecondaryButton icon={<MoreHorizontal />} aria-label="More quiz actions" title="More actions" />}
    />
  );
}

export default QuizMoreMenu;
