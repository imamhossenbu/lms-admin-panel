"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface WizardHeaderProps {
  mode: "create" | "edit";
  courseId: string;
  courseTitle: string;
  /** "Module 1: Getting Started" (live from the form). */
  moduleLabel: string;
  assignmentTitle?: string;
  onBack: () => void;
}

/** Breadcrumb + "← Back to Assignments" + title / subtitle. */
export function WizardHeader({ mode, courseId, courseTitle, moduleLabel, assignmentTitle, onBack }: WizardHeaderProps) {
  const isEdit = mode === "edit";
  const subtitle = isEdit
    ? `Update ${assignmentTitle ? `"${assignmentTitle}"` : "this assignment"}${moduleLabel ? ` in ${moduleLabel}` : ""}`
    : `Create a new assignment${moduleLabel ? ` for ${moduleLabel}` : ""}`;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseId}` },
          { label: "Assignments", href: "/assignments" },
          { label: isEdit ? "Edit Assignment" : "Create Assignment" },
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start"
      >
        <SecondaryButton leftIcon={<ArrowLeft />} onClick={onBack} className="shrink-0">
          Back to Assignments
        </SecondaryButton>
        <div className="min-w-0">
          <h1 className="heading-h2-bold text-primary-500">{isEdit ? "Edit Assignment" : "Create Assignment"}</h1>
          <p className="mt-1 body-regular text-primary-300 truncate">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default WizardHeader;
