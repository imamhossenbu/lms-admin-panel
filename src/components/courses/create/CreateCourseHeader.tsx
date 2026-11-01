"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, FileText, Home, Send } from "lucide-react";
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
}

export function CreateCourseHeader({ isSavingDraft, disabled, onSaveDraft, onPreview, onPublish, isPublishing = false }: CreateCourseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 text-left"
    >
      <Breadcrumb
        items={[
          { label: "", href: "/", icon: <Home className="w-4 h-4" /> },
          { label: "Courses", href: "/courses" },
          { label: "Create Course" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="heading-h3-bold font-bold text-primary-500 tracking-tight">Create New Course</h1>
          <p className="body-regular text-primary-300 mt-1">
            Set up your course details, curriculum, pricing and publish it to your students.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <SecondaryButton
            leftIcon={<FileText />}
            onClick={onSaveDraft}
            isLoading={isSavingDraft}
            disabled={disabled}
          >
            {isSavingDraft ? "Saving..." : "Save as Draft"}
          </SecondaryButton>
          {onPublish ? (
            <PrimaryButton
              leftIcon={<Send />}
              onClick={onPublish}
              isLoading={isPublishing}
              disabled={disabled}
              className="edupro-glow-btn"
            >
              {isPublishing ? "Publishing..." : "Publish Course"}
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
