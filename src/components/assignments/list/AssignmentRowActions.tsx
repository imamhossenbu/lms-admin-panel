"use client";

import React from "react";
import { motion } from "framer-motion";
import { Archive, Copy, Eye, Pencil, Send, Trash2 } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";

const ICON = "w-3.5 h-3.5 text-primary-400";

export interface AssignmentRowHandlers {
  onView: (a: AssignmentItem) => void;
  onEdit: (a: AssignmentItem) => void;
  onDuplicate: (a: AssignmentItem) => void;
  onToggleStatus: (a: AssignmentItem) => void;
  onDelete: (a: AssignmentItem) => void;
  /** Row currently being mutated (disables its menu actions). */
  busyId: string | null;
}

/** ⋮ menu: Duplicate, Publish/Unpublish, Delete. */
export function assignmentMenuItems(a: AssignmentItem, h: AssignmentRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === a.id;
  const published = a.status === "PUBLISHED";
  return [
    { key: "duplicate", label: "Duplicate", icon: <Copy className={ICON} />, disabled: busy, onClick: () => h.onDuplicate(a) },
    {
      key: "status",
      label: published ? "Unpublish" : "Publish",
      icon: published ? <Archive className={ICON} /> : <Send className={ICON} />,
      disabled: busy,
      onClick: () => h.onToggleStatus(a),
    },
    { key: "delete", label: "Delete", icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, onClick: () => h.onDelete(a) },
  ];
}

function IconAction({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex w-9 h-9 items-center justify-center rounded-lg border border-dash bg-white text-blue hover:bg-blue-14 transition-colors cursor-pointer"
    >
      {children}
    </motion.button>
  );
}

/** View (eye) + Edit (pencil) + ⋮ menu. */
export function AssignmentRowActions({ assignment, handlers }: { assignment: AssignmentItem; handlers: AssignmentRowHandlers }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <IconAction label={`View ${assignment.title}`} onClick={() => handlers.onView(assignment)}>
        <Eye className="w-4 h-4" />
      </IconAction>
      <IconAction label={`Edit ${assignment.title}`} onClick={() => handlers.onEdit(assignment)}>
        <Pencil className="w-4 h-4" />
      </IconAction>
      <RowMoreMenu label={`More actions for ${assignment.title}`} items={assignmentMenuItems(assignment, handlers)} />
    </div>
  );
}

export default AssignmentRowActions;
