"use client";

import React from "react";
import { CircleCheck, CircleX, Pencil, Reply, RotateCcw, ShieldOff, Trash2 } from "lucide-react";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import type { ThreadReply } from "@/types/community";

export interface ReplyActionBarProps {
  reply: ThreadReply;
  /** Show "Mark as answer" (QUESTION thread, top-level, not removed). */
  canAccept: boolean;
  /** Own reply → can edit. */
  canEdit: boolean;
  /** Thread locked → no new replies. */
  isLocked: boolean;
  replyActive: boolean;
  onReply: () => void;
  onEdit: () => void;
  onToggleAccepted: () => void;
  onToggleRemoved: () => void;
  onDelete: () => void;
}

/** Reply footer: Reply, Mark as answer / Unmark, and ⋯ (Edit, Remove / Restore, Delete). */
export function ReplyActionBar({ reply, canAccept, canEdit, isLocked, replyActive, onReply, onEdit, onToggleAccepted, onToggleRemoved, onDelete }: ReplyActionBarProps) {
  const items: DropdownActionItem[] = [
    ...(canEdit && !reply.isRemoved ? [{ key: "edit", label: "Edit Reply", icon: <Pencil className="h-4 w-4" />, onClick: onEdit }] : []),
    reply.isRemoved
      ? { key: "restore", label: "Restore Reply", icon: <RotateCcw className="h-4 w-4" />, onClick: onToggleRemoved }
      : { key: "remove", label: "Remove Reply", icon: <ShieldOff className="h-4 w-4" />, onClick: onToggleRemoved },
    { key: "delete", label: "Delete Permanently", icon: <Trash2 className="h-4 w-4" />, onClick: onDelete, danger: true, separatorBefore: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reply.isRemoved ? (
        <CardActionButton icon={<RotateCcw />} onClick={onToggleRemoved}>
          Restore
        </CardActionButton>
      ) : (
        <>
          <CardActionButton icon={<Reply />} onClick={onReply} active={replyActive} disabled={isLocked}>
            Reply
          </CardActionButton>
          {canAccept && (
            <CardActionButton
              icon={reply.isAccepted ? <CircleX /> : <CircleCheck />}
              onClick={onToggleAccepted}
              className={reply.isAccepted ? undefined : "text-green"}
            >
              {reply.isAccepted ? "Unmark answer" : "Mark as answer"}
            </CardActionButton>
          )}
        </>
      )}
      <div className="ml-auto">
        <RowMoreMenu size="sm" label="Reply actions" items={items} />
      </div>
    </div>
  );
}

export default ReplyActionBar;
