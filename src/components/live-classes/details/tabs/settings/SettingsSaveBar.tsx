"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, RotateCcw, Save } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface SettingsSaveBarProps {
  visible: boolean;
  isSaving: boolean;
  onDiscard: () => void;
  formId: string;
}

/** Sticky "unsaved changes" bar with Discard + Save Settings (only while the form is dirty). */
export function SettingsSaveBar({ visible, isSaving, onDiscard, formId }: SettingsSaveBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="sticky bottom-4 z-30 flex flex-col gap-3 rounded-xl border border-dash bg-white p-3.5 shadow-lg sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-center gap-2 body-sm-medium text-primary-500">
            <AlertCircle className="h-4 w-4 shrink-0 text-yellow" />
            You have unsaved class settings.
          </p>
          <div className="flex items-center justify-end gap-2.5">
            <SecondaryButton size="sm" leftIcon={<RotateCcw />} onClick={onDiscard} disabled={isSaving}>
              Discard
            </SecondaryButton>
            <PrimaryButton size="sm" type="submit" form={formId} leftIcon={<Save />} isLoading={isSaving} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettingsSaveBar;
