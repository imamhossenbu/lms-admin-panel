"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircleAlert, CircleCheck } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import { RoleSubmitButton, type RoleEditorMode } from "./RoleEditorHeader";

export interface RoleSaveBarProps {
  mode: Exclude<RoleEditorMode, "view">;
  isDirty: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

/** Sticky bottom bar: unsaved state + Cancel + orange Create role / Save changes. */
export function RoleSaveBar({ mode, isDirty, isSubmitting, onCancel }: RoleSaveBarProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="sticky bottom-4 z-30" role="region" aria-label="Save role">
      <div className="flex flex-col gap-3 rounded-2xl border border-dash bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:pl-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", isDirty ? "bg-yellow-bg text-yellow" : "bg-green-bg text-green")}>
            {isDirty ? <CircleAlert className="h-4.5 w-4.5" /> : <CircleCheck className="h-4.5 w-4.5" />}
          </span>
          <div className="min-w-0">
            <p className="body-sm-medium font-semibold! text-primary-500">{isDirty ? "You have unsaved changes" : mode === "create" ? "Fill in the details to create the role" : "All changes saved"}</p>
            <p className="body-xsm-regular text-primary-300">{mode === "create" ? "Fields marked * are required. View is added automatically when you allow any other action." : "Leaving this page will ask before discarding edits."}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2.5">
          <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <RoleSubmitButton mode={mode} isSubmitting={isSubmitting} />
        </div>
      </div>
    </motion.div>
  );
}

export default RoleSaveBar;
