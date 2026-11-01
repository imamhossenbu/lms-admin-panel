"use client";

import React from "react";
import { motion } from "framer-motion";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";

export interface WizardHeaderProps {
  mode: "create" | "edit";
  /** Selected course title ("" before one is chosen). */
  courseTitle: string;
  /** "Module 1: Getting Started" (live from the form). */
  moduleLabel: string;
  /** Edit mode: the saved assignment. */
  assignmentId?: string;
  assignmentTitle?: string;
}

/** Breadcrumb (🏠 › Assignments › Create Assignment | {title} › Edit) + title / subtitle. */
export function WizardHeader({ mode, courseTitle, moduleLabel, assignmentId, assignmentTitle }: WizardHeaderProps) {
  const isEdit = mode === "edit";
  const location = [courseTitle, moduleLabel].filter(Boolean).join(" • ");
  const subtitle = isEdit
    ? `Update ${assignmentTitle ? `"${assignmentTitle}"` : "this assignment"}${location ? ` in ${location}` : ""}`
    : `Create a new assignment${location ? ` for ${location}` : ""}`;
  const items: BreadcrumbItem[] = isEdit
    ? [
        { label: "Assignments", href: "/assignments" },
        { label: assignmentTitle || "Assignment", href: assignmentId ? `/assignments/${assignmentId}` : undefined },
        { label: "Edit" },
      ]
    : [{ label: "Assignments", href: "/assignments" }, { label: "Create Assignment" }];

  return (
    <div className="space-y-4">
      <Breadcrumb items={items} />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-w-0"
      >
        <h1 className="heading-h2-bold text-primary-500">{isEdit ? "Edit Assignment" : "Create Assignment"}</h1>
        <p className="mt-1 body-regular text-primary-300 truncate">{subtitle}</p>
      </motion.div>
    </div>
  );
}

export default WizardHeader;
