"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { courseBasicInfoSchema, type CourseBasicInfoInput } from "@/validations/courseSchema";
import { CreateCourseHeader } from "./CreateCourseHeader";
import { CourseStepper } from "./CourseStepper";
import { BasicInformationCard } from "./BasicInformationCard";
import { CoursePreviewCard } from "./CoursePreviewCard";
import { CoursePreviewModal } from "./CoursePreviewModal";
import { CreateCourseActions } from "./CreateCourseActions";
import { CourseCreateSkeleton } from "./CourseCreateSkeleton";
import { GenerateCourseAiModal } from "./GenerateCourseAiModal";
import { AiOutlineReviewModal } from "./AiOutlineReviewModal";
import { EMPTY_BASIC_INFO, levelLabel, listItemsFromHtml } from "./createCourseOptions";
import { useCreateCourseData } from "./hooks/useCreateCourseData";
import { useCourseAiFlow } from "./hooks/useCourseAiFlow";
import { usePreviewTab } from "./hooks/usePreviewTab";
import { useSaveCourse, type SaveIntent } from "./hooks/useSaveCourse";
import type { CoursePreviewData } from "./preview/previewTypes";

/** Create Course — Step 1 (Basic Information) with live preview and the AI curriculum flow. */
export function CreateCourseView() {
  const router = useRouter();
  const { categories, instructors, isLoading } = useCreateCourseData();
  const [previewTab, setPreviewTab] = usePreviewTab();
  const { save, savingIntent } = useSaveCourse();

  const form = useForm<CourseBasicInfoInput>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: EMPTY_BASIC_INFO,
    mode: "onTouched",
  });
  const ai = useCourseAiFlow(form);
  const values = useWatch({ control: form.control }) as CourseBasicInfoInput;

  const [instructorId, setInstructorId] = useState("");
  const [uploads, setUploads] = useState({ thumbnail: false, video: false });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const isUploading = uploads.thumbnail || uploads.video;
  const isSaving = savingIntent !== null;
  const instructor = instructors.find((i) => i.id === instructorId) ?? instructors[0] ?? null;

  const previewData = useMemo<CoursePreviewData>(() => {
    const outcomes = ai.acceptedOutline?.learningOutcomes ?? [];
    return {
      title: values.title?.trim() ?? "",
      shortDescription: values.shortDescription?.trim() ?? "",
      thumbnail: values.thumbnail ?? "",
      promoVideo: values.promoVideo ?? "",
      categoryName: categories.find((c) => c.id === values.categoryId)?.name ?? "",
      subcategory: values.subcategory ?? "",
      language: values.language ?? "",
      levelLabel: levelLabel(values.level),
      outline: ai.acceptedOutline,
      learnItems: outcomes.length ? outcomes : listItemsFromHtml(values.description ?? ""),
      instructor,
    };
  }, [values, categories, ai.acceptedOutline, instructor]);

  const previewProps = {
    data: previewData,
    tab: previewTab,
    onTabChange: setPreviewTab,
    instructors,
    onInstructorChange: setInstructorId,
  };

  const submit = (intent: SaveIntent) => {
    if (isUploading) {
      toast.error("Upload in progress", { description: "Please wait for your media to finish uploading." });
      return;
    }
    void form.handleSubmit(
      async (data) => {
        const courseId = await save(data, ai.acceptedOutline, intent);
        if (!courseId) return;
        form.reset(data);
        router.push(intent === "draft" ? "/courses" : `/courses/${courseId}/edit`);
      },
      () =>
        toast.error("Please complete the required fields", {
          description: "Some course details are missing or invalid. Check the highlighted fields.",
        })
    )();
  };

  const handleCancel = () => {
    if (form.formState.isDirty || ai.acceptedOutline) setIsDiscardOpen(true);
    else router.push("/courses");
  };

  if (isLoading) return <CourseCreateSkeleton />;

  return (
    <FormProvider {...form}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="space-y-5 text-left pb-10"
      >
        <CreateCourseHeader
          isSavingDraft={savingIntent === "draft"}
          disabled={isSaving}
          onSaveDraft={() => submit("draft")}
          onPreview={() => setIsPreviewOpen(true)}
        />

        <CourseStepper activeStep={1} />

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit("continue");
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-8 min-w-0"
          >
            <BasicInformationCard
              categories={categories}
              acceptedOutline={ai.acceptedOutline}
              onGenerateAi={ai.openGenerate}
              onViewOutline={ai.viewAccepted}
              onRemoveOutline={ai.removeAccepted}
              onUploadingChange={(kind, uploading) => setUploads((prev) => ({ ...prev, [kind]: uploading }))}
            />
          </motion.div>

          <div className="lg:col-span-4 min-w-0 space-y-5 lg:sticky lg:top-6">
            <CoursePreviewCard {...previewProps} onExpand={() => setIsPreviewOpen(true)} />
            <CreateCourseActions
              isContinuing={savingIntent === "continue"}
              disabled={isSaving}
              onCancel={handleCancel}
              onContinue={() => submit("continue")}
            />
          </div>
        </form>
      </motion.div>

      <CoursePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} {...previewProps} />

      <GenerateCourseAiModal {...ai.generateModal} />
      <AiOutlineReviewModal {...ai.reviewModal} thumbnailUrl={values.thumbnail || undefined} />

      <ConfirmModal
        isOpen={isDiscardOpen}
        title="Discard this course?"
        subtitle="Your unsaved changes will be lost."
        message="You have unsaved course details. Leaving now will discard everything you've entered on this page."
        confirmLabel="Discard & Leave"
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={async () => {
          router.push("/courses");
        }}
      />
    </FormProvider>
  );
}

export default CreateCourseView;
