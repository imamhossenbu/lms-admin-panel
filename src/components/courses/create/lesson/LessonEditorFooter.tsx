"use client";

import React from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonTab } from "@/validations/lessonFormSchema";

const NEXT_LABEL: Record<LessonTab, string> = {
  basic: "Next: Add Content",
  content: "Next: Resources",
  resources: "Next: Settings",
  settings: "",
};

export interface LessonEditorFooterProps {
  tab: LessonTab;
  isFirst: boolean;
  isLast: boolean;
  isEdit: boolean;
  /** Which action is running (disables every button, shows a spinner on that one). */
  busy: "draft" | "publish" | "next" | null;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export function LessonEditorFooter({
  tab,
  isFirst,
  isLast,
  isEdit,
  busy,
  onCancel,
  onBack,
  onNext,
  onSaveDraft,
  onSubmit,
}: LessonEditorFooterProps) {
  const disabled = busy !== null;
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <SecondaryButton type="button" size="lg" onClick={onCancel} disabled={disabled}>
        Cancel
      </SecondaryButton>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <SecondaryButton
          type="button"
          size="lg"
          leftIcon={<FileText />}
          onClick={onSaveDraft}
          disabled={disabled && busy !== "draft"}
          isLoading={busy === "draft"}
        >
          Save as Draft
        </SecondaryButton>
        {!isFirst && (
          <SecondaryButton type="button" size="lg" leftIcon={<ArrowLeft />} onClick={onBack} disabled={disabled}>
            Previous
          </SecondaryButton>
        )}
        {isLast ? (
          <PrimaryButton
            type="button"
            size="lg"
            rightIcon={<ArrowRight />}
            onClick={onSubmit}
            disabled={disabled && busy !== "publish"}
            isLoading={busy === "publish"}
          >
            {isEdit ? "Save Lesson" : "Create Lesson"}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="button"
            size="lg"
            rightIcon={<ArrowRight />}
            onClick={onNext}
            disabled={disabled && busy !== "next"}
            isLoading={busy === "next"}
          >
            {NEXT_LABEL[tab]}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export default LessonEditorFooter;
