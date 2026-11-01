"use client";

import React from "react";
import { Settings2 } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { ControlledToggleRow } from "../../shared/ControlledToggleRow";

/** Right "Note Settings": enable notes + show in instructor view. */
export function NoteSettingsCard() {
  return (
    <EditorSectionCard icon={<Settings2 className="h-5 w-5" />} title="Note Settings" description="Configure note preferences for this lesson." bodyClassName="space-y-5">
      <ControlledToggleRow name="notes.enabled" title="Enable Instructor Notes" description="Allow adding private notes for this lesson." />
      <ControlledToggleRow name="notes.showInInstructorView" title="Show notes in instructor view" description="Display notes in instructor lesson view page." />
    </EditorSectionCard>
  );
}

export default NoteSettingsCard;
