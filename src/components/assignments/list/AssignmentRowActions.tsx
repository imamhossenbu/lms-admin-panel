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
  /** Opens the wizard at /assignments/[id]/edit. */
  onEdit: (a: AssignmentItem) => void;
  onDuplicate: (a: AssignmentItem) => void;
  onToggleStatus: (a: AssignmentItem) => void;
  onDelete: (a: AssignmentItem) => void;
  /** Row currently being mutated (disables its menu actions). */
  busyId: string | null;
}

/** ⋮ menu: Edit, Duplicate, Publish/Unpublish, Delete. */
export function assignmentMenuItems(a: AssignmentItem, h: AssignmentRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === a.id;
  const published = a.status === "PUBLISHED";
  return [
    { key: "edit", label: "Edit", icon: <Pencil className={ICON} />, onClick: () => h.onEdit(a) },
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

/** View (eye) + ⋮ menu. */
export function AssignmentRowActions({ assignment, handlers }: { assignment: AssignmentItem; handlers: AssignmentRowHandlers }) {
  const label = `View ${assignment.title}`;
  return (
    <div className="flex items-center justify-center gap-1.5">
      <motion.button
        type="button"
        aria-label={label}
        title={label}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          e.stopPropagation();
          handlers.onView(assignment);
        }}
        className="inline-flex w-7 h-7 items-center justify-center rounded-lg border border-dash bg-white text-blue hover:bg-blue-14 transition-colors cursor-pointer"
      >
        <Eye className="w-4 h-4" />
      </motion.button>
      <RowMoreMenu size="sm" label={`More actions for ${assignment.title}`} items={assignmentMenuItems(assignment, handlers)} />
    </div>
  );
}

export default AssignmentRowActions;
