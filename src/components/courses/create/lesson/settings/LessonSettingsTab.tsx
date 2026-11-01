"use client";

import React from "react";
import { motion } from "framer-motion";
import { VisibilitySetting } from "./VisibilitySetting";
import { ReleaseSetting } from "./ReleaseSetting";
import { DripDurationField } from "./DripDurationField";
import { CompletionSetting } from "./CompletionSetting";
import { AccessSetting } from "./AccessSetting";
import { TagsSetting } from "./TagsSetting";
import { InstructorNotesSetting } from "./InstructorNotesSetting";

/** "Settings" tab of the Add Lesson modal. */
export function LessonSettingsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="border-b border-dash pb-4">
        <h3 className="title-bold text-primary-500">Lesson Settings</h3>
        <p className="body-sm-regular text-primary-300 mt-1">Configure additional settings for this lesson.</p>
      </div>
      <VisibilitySetting />
      <ReleaseSetting />
      <DripDurationField />
      <CompletionSetting />
      <AccessSetting />
      <TagsSetting />
      <InstructorNotesSetting />
    </motion.div>
  );
}

export default LessonSettingsTab;
