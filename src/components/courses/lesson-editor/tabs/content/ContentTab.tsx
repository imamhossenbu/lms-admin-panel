"use client";

import React from "react";
import type { LessonEditorTabProps } from "../../tabTypes";
import { TabColumns } from "../../fields/TabColumns";
import { LessonContentCard } from "./LessonContentCard";
import { LessonNavigation } from "./LessonNavigation";
import { PublishStatusCard } from "./PublishStatusCard";
import { LessonThumbnailCard } from "./LessonThumbnailCard";
import { LessonOrderCard } from "./LessonOrderCard";

/** Content tab: lesson basics + body (left), publish status, thumbnail and order (right). */
export function ContentTab({ context, courseId, lessonId, onUploadingChange }: LessonEditorTabProps) {
  return (
    <TabColumns
      main={
        <>
          <LessonContentCard context={context} />
          <LessonNavigation courseId={courseId} lessonId={lessonId} lessons={context.lessons} />
        </>
      }
      side={
        <>
          <PublishStatusCard />
          <LessonThumbnailCard onUploadingChange={onUploadingChange} />
          <LessonOrderCard />
        </>
      }
    />
  );
}

export default ContentTab;
