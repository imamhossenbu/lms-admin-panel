"use client";

import React from "react";
import { LessonTextFields } from "./LessonTextFields";
import { LessonTypePicker } from "./LessonTypePicker";
import { LessonDurationField } from "./LessonDurationField";
import { LessonDifficultyField, LessonPrerequisiteField } from "./LessonSelectFields";
import { LessonThumbnailField } from "./LessonThumbnailField";
import { AiThumbnailGenerator } from "./AiThumbnailGenerator";

export interface LessonBasicInfoTabProps {
  /** Other lessons of the course outline ("Module N · Lesson title"). */
  prerequisiteOptions: { value: string; label: string }[];
  onUploadingChange?: (uploading: boolean) => void;
}

/** Basic Info tab: title, description, type, duration / difficulty / prerequisite and thumbnail. */
export function LessonBasicInfoTab({ prerequisiteOptions, onUploadingChange }: LessonBasicInfoTabProps) {
  return (
    <div className="space-y-5">
      <LessonTextFields />
      <LessonTypePicker />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <LessonDurationField />
        <LessonDifficultyField />
        <LessonPrerequisiteField options={prerequisiteOptions} />
      </div>
      <div className="grid grid-cols-1 gap-5 border-t border-dash pt-5 sm:grid-cols-2">
        <LessonThumbnailField onUploadingChange={onUploadingChange} />
        <AiThumbnailGenerator />
      </div>
    </div>
  );
}

export default LessonBasicInfoTab;
