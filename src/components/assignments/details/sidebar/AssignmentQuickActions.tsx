"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Download, Eye, FileDown, FileSpreadsheet, FileText, Mail, Pencil, Settings, Trash2, Users, type LucideIcon } from "lucide-react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { AssignmentDetailTab } from "../tabTypes";
import { useAssignmentActions } from "../hooks/useAssignmentActions";
import { QuickActionRow } from "./QuickActionRow";
import { DeleteAssignmentModal } from "./DeleteAssignmentModal";

export type QuickActionKey =
  | "preview"
  | "viewInstructions"
  | "viewSubmissions"
  | "downloadSubmissions"
  | "downloadReport"
  | "exportCsv"
  | "remind"
  | "edit"
  | "duplicate"
  | "delete";

export interface AssignmentQuickActionsProps {
  assignment: AssignmentItem;
  submissions: AssignmentSubmission[];
  /** Which actions to show, in order. */
  actions: QuickActionKey[];
  onTabChange: (tab: AssignmentDetailTab) => void;
  onPreview?: () => void;
}

const META: Record<QuickActionKey, { label: string; icon: LucideIcon; danger?: boolean }> = {
  preview: { label: "Preview Assignment", icon: Eye },
  viewInstructions: { label: "View Instructions", icon: FileText },
  viewSubmissions: { label: "View Submissions", icon: Users },
  downloadSubmissions: { label: "Download All Submissions", icon: Download },
  downloadReport: { label: "Download Report", icon: FileDown },
  exportCsv: { label: "Export as CSV", icon: FileSpreadsheet },
  remind: { label: "Send Reminder to Pending Students", icon: Mail },
  edit: { label: "Edit Assignment", icon: Pencil },
  duplicate: { label: "Duplicate Assignment", icon: Copy },
  delete: { label: "Delete Assignment", icon: Trash2, danger: true },
};

/** "Quick Actions" card — every action is implemented here (navigation, toasts, CSV download, delete confirm). */
export function AssignmentQuickActions({ assignment, submissions, actions, onTabChange, onPreview }: AssignmentQuickActionsProps) {
  const router = useRouter();
  const act = useAssignmentActions(assignment, submissions);

  const handlers: Record<QuickActionKey, () => void> = {
    preview: () => onPreview?.(),
    viewInstructions: () => onTabChange("instructions"),
    viewSubmissions: () => onTabChange("submissions"),
    downloadSubmissions: () => act.exportCsv("submissions"),
    downloadReport: () => act.exportCsv("report"),
    exportCsv: () => act.exportCsv("export"),
    remind: () => void act.remind(),
    edit: () => router.push(`/assignments/${assignment.id}/edit`),
    duplicate: () => void act.duplicate(),
    delete: act.openDelete,
  };

  const isDisabled = (key: QuickActionKey) =>
    (key === "remind" && act.busy === "remind") || (key === "duplicate" && act.busy === "duplicate") || (key === "preview" && !onPreview);

  return (
    <>
      <IconSectionCard icon={<Settings className="h-5 w-5" />} title="Quick Actions" bodyClassName="mt-3 border-t border-dash pt-2">
        <ul className="space-y-0.5">
          {actions.map((key, i) => (
            <motion.li key={key} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
              <QuickActionRow icon={META[key].icon} label={META[key].label} danger={META[key].danger} onClick={handlers[key]} disabled={isDisabled(key)} />
            </motion.li>
          ))}
        </ul>
      </IconSectionCard>

      <DeleteAssignmentModal
        isOpen={act.isDeleteOpen}
        title={assignment.title}
        submissionCount={submissions.length}
        onClose={act.closeDelete}
        onConfirm={act.confirmDelete}
      />
    </>
  );
}

export default AssignmentQuickActions;
