"use client";

import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { LessonEditorHeader } from "./LessonEditorHeader";
import { CourseSummaryBanner } from "./CourseSummaryBanner";
import { LessonEditorTabs } from "./LessonEditorTabs";
import { LessonEditorPanels } from "./LessonEditorPanels";
import { LessonEditorSkeleton } from "./LessonEditorSkeleton";
import { LessonPreviewModal } from "./LessonPreviewModal";
import { useLessonEditorTab } from "./hooks/useLessonEditorTab";
import { tabsWithErrors, useLessonEditorForm } from "./hooks/useLessonEditorForm";
import { useUploadTracker } from "./hooks/useUploadTracker";

export interface LessonEditorViewProps {
  courseId: string;
  lessonId: string;
}

/** Full-page Edit Lesson screen: header, course card, URL-synced tab bar and all tab bodies on one form. */
export function LessonEditorView({ courseId, lessonId }: LessonEditorViewProps) {
  const { activeTab, setActiveTab } = useLessonEditorTab();
  const { form, context, isLoading, submit } = useLessonEditorForm({ courseId, lessonId, onInvalidTab: setActiveTab });
  const { isUploading, reporters } = useUploadTracker();
  const { isDirty, isSubmitting, errors } = form.formState;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Browser reload / tab close with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  if (isLoading || !context) return <LessonEditorSkeleton />;

  return (
    <FormProvider {...form}>
      {/* A div, not a <form>: modal forms rendered through portals would otherwise bubble submit events here. */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-6"
      >
        <LessonEditorHeader
          courseId={courseId}
          courseTitle={context.course.title}
          isSaving={isSubmitting}
          isUploading={isUploading}
          onPreview={() => setIsPreviewOpen(true)}
          onUpdate={() => void submit()}
        />
        <CourseSummaryBanner course={context.course} />
        <LessonEditorTabs activeTab={activeTab} onChange={setActiveTab} errorTabs={tabsWithErrors(errors)} />
        <LessonEditorPanels
          activeTab={activeTab}
          context={context}
          courseId={courseId}
          lessonId={lessonId}
          uploadReporters={reporters}
        />
      </motion.div>

      <LessonPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} control={form.control} context={context} />
    </FormProvider>
  );
}

export default LessonEditorView;
