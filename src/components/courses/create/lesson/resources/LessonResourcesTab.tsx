"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadFilesCard } from "./UploadFilesCard";
import { ExternalLinksCard } from "./ExternalLinksCard";

interface LessonResourcesTabProps {
  /** Notified while resource files are uploading (e.g. to disable Save / Next). */
  onUploadingChange?: (uploading: boolean) => void;
}

/** "Resources" tab of the Add Lesson modal: downloadable files + external links. */
export function LessonResourcesTab({ onUploadingChange }: LessonResourcesTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5"
    >
      <div>
        <h3 className="title-bold text-primary-500">Lesson Resources</h3>
        <p className="body-sm-regular text-primary-300 mt-1">
          Add downloadable files, links and additional resources to help students learn better.
        </p>
      </div>
      <UploadFilesCard onUploadingChange={onUploadingChange} />
      <ExternalLinksCard />
    </motion.div>
  );
}

export default LessonResourcesTab;
