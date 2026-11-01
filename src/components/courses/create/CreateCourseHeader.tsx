"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, FileText, Send } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";

interface CreateCourseHeaderProps {
  isSavingDraft: boolean;
  disabled: boolean;
  onSaveDraft: () => void;
  onPreview: () => void;
  /** On the Review step the primary action becomes "Publish Course". */
  onPublish?: () => void;
  isPublishing?: boolean;
  /** Edit mode texts. */
  title?: string;
  subtitle?: string;
  breadcrumbLabel?: string;
  draftLabel?: string;
  publishLabel?: string;
}

export function CreateCourseHeader({
  isSavingDraft,
  disabled,
  onSaveDraft,
  onPreview,
  onPublish,
  isPublishing = false,
  title = "Create New Course",
  subtitle = "Set up your course details, curriculum, pricing and publish it to your students.",
  breadcrumbLabel = "Create Course",
  draftLabel = "Save as Draft",
  publishLabel = "Publish Course",
}: CreateCourseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 text-left"
    >
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="heading-h3-bold text-primary-500 tracking-tight">{title}</h1>
          <p className="body-regular text-primary-300 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <SecondaryButton
            leftIcon={<FileText />}
            onClick={onSaveDraft}
            isLoading={isSavingDraft}
            disabled={disabled}
          >
            {isSavingDraft ? "Saving..." : draftLabel}
          </SecondaryButton>
          {onPublish ? (
            <PrimaryButton
              leftIcon={<Send />}
              onClick={onPublish}
              isLoading={isPublishing}
              disabled={disabled}
              className="edupro-glow-btn"
            >
              {isPublishing ? "Publishing..." : publishLabel}
            </PrimaryButton>
          ) : (
            <PrimaryButton leftIcon={<Eye />} onClick={onPreview} className="edupro-glow-btn">
              Preview Course
            </PrimaryButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CreateCourseHeader;
