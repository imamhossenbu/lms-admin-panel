"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useUrlParams } from "@/lib/useUrlParams";
import { courseBasicInfoSchema, type CourseBasicInfoInput } from "@/validations/courseSchema";
import type { CurriculumModuleInput } from "@/validations/courseOutlineSchema";
import { CreateCourseHeader } from "./CreateCourseHeader";
import { CourseStepper } from "./CourseStepper";
import { BasicInformationCard } from "./BasicInformationCard";
import { CoursePreviewCard } from "./CoursePreviewCard";
import { CoursePreviewModal } from "./CoursePreviewModal";
import { CreateCourseActions } from "./CreateCourseActions";
import { CourseCreateSkeleton } from "./CourseCreateSkeleton";
import { GenerateCourseAiModal } from "./GenerateCourseAiModal";
import { AiOutlineReviewModal } from "./AiOutlineReviewModal";
import { CourseCurriculumCard } from "./curriculum/CourseCurriculumCard";
import { ModulePanel } from "./curriculum/ModulePanel";
import { moduleToPanel, saveModuleFromPanel } from "./curriculum/curriculumEditing";
import { EMPTY_OUTLINE, getOutlineIssues } from "./outline/outlineEditing";
import { EMPTY_BASIC_INFO, levelLabel, listItemsFromHtml } from "./createCourseOptions";
import type { AiOutline } from "./aiOutline";
import { useCreateCourseData } from "./hooks/useCreateCourseData";
import { useCourseAiFlow } from "./hooks/useCourseAiFlow";
import { usePreviewTab } from "./hooks/usePreviewTab";
import { useSaveCourse, type SaveIntent } from "./hooks/useSaveCourse";
import { clearCreateCourseDraft, useCreateCourseDraft } from "./hooks/useCreateCourseDraft";
import type { CoursePreviewData } from "./preview/previewTypes";

type ModulePanelState = { mode: "create" } | { mode: "edit"; moduleId: string } | null;

/** Create Course: Step 1 (Basic Information) and Step 2 (Curriculum), with live preview and the AI flow. */
export function CreateCourseView() {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const step = get("step") === "curriculum" ? 2 : 1;

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
  const { isRestored } = useCreateCourseDraft(form, ai.acceptedOutline, ai.setAcceptedOutline, !isLoading);

  const [instructorId, setInstructorId] = useState("");
  const [uploads, setUploads] = useState({ thumbnail: false, video: false, module: false });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [panel, setPanel] = useState<ModulePanelState>(null);

  const isUploading = uploads.thumbnail || uploads.video || uploads.module;
  const isSaving = savingIntent !== null;
  const instructor = instructors.find((i) => i.id === instructorId) ?? instructors[0] ?? null;
  const curriculum: AiOutline = ai.acceptedOutline ?? { ...EMPTY_OUTLINE, title: values.title ?? "", level: values.level ?? "BEGINNER" };

  // Opening step 2 directly (reload/bookmark) needs valid basic info; otherwise go back to step 1.
  useEffect(() => {
    if (!isRestored || step !== 2) return;
    if (!courseBasicInfoSchema.safeParse(form.getValues()).success) {
      set({ step: null });
      toast.info("Complete the basic information first", { description: "Course details are required before building the curriculum." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestored, step]);

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

  const invalidFormToast = () =>
    toast.error("Please complete the required fields", {
      description: "Some course details are missing or invalid. Check the highlighted fields.",
    });

  const submit = (intent: SaveIntent) => {
    if (isUploading) {
      toast.error("Upload in progress", { description: "Please wait for your media to finish uploading." });
      return;
    }
    void form.handleSubmit(async (data) => {
      const courseId = await save(data, ai.acceptedOutline, intent);
      if (!courseId) return;
      clearCreateCourseDraft();
      form.reset(data);
      router.push(intent === "draft" ? "/courses" : `/courses/${courseId}/edit`);
    }, step === 2 ? () => { set({ step: null }); invalidFormToast(); } : invalidFormToast)();
  };

  const goToCurriculum = () => {
    if (isUploading) {
      toast.error("Upload in progress", { description: "Please wait for your media to finish uploading." });
      return;
    }
    void form.handleSubmit(() => {
      set({ step: "curriculum" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, invalidFormToast)();
  };

  const continueToPricing = () => {
    const issues = getOutlineIssues(curriculum);
    if (issues.messages.length) {
      toast.error("Curriculum isn't ready yet", { description: issues.messages.slice(0, 3).join(" ") });
      return;
    }
    submit("continue");
  };

  const setCurriculum = (next: AiOutline) => ai.setAcceptedOutline(next);

  const handlePanelSubmit = (panelValues: CurriculumModuleInput) => {
    if (!panel) return;
    const result = saveModuleFromPanel(curriculum, panelValues, panel.mode === "edit" ? panel.moduleId : undefined);
    setCurriculum(result.outline);
    toast.success(panel.mode === "edit" ? "Module updated" : "Module created", { description: panelValues.title.trim() });
    setPanel(null);
  };

  const editingModule = panel?.mode === "edit" ? curriculum.modules.find((m) => m.id === panel.moduleId) : undefined;
  const panelInitialValues = useMemo(() => (editingModule ? moduleToPanel(editingModule) : undefined), [editingModule]);

  const handleCancel = () => {
    if (form.formState.isDirty || ai.acceptedOutline) setIsDiscardOpen(true);
    else router.push("/courses");
  };

  if (isLoading || !isRestored) return <CourseCreateSkeleton />;

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

        <CourseStepper activeStep={step} onStepClick={(target) => target === 1 && set({ step: null })} />

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.form
              key="basic"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                goToCurriculum();
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
            >
              <div className="lg:col-span-8 min-w-0">
                <BasicInformationCard
                  categories={categories}
                  acceptedOutline={ai.acceptedOutline}
                  onGenerateAi={ai.openGenerate}
                  onViewOutline={ai.viewAccepted}
                  onRemoveOutline={ai.removeAccepted}
                  onUploadingChange={(kind, uploading) => setUploads((prev) => ({ ...prev, [kind]: uploading }))}
                />
              </div>
              <div className="lg:col-span-4 min-w-0 space-y-5 lg:sticky lg:top-6">
                <CoursePreviewCard {...previewProps} onExpand={() => setIsPreviewOpen(true)} />
                <CreateCourseActions
                  isContinuing={false}
                  disabled={isSaving}
                  onCancel={handleCancel}
                  onContinue={goToCurriculum}
                />
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
            >
              <div className="lg:col-span-8 min-w-0">
                <CourseCurriculumCard
                  curriculum={curriculum}
                  onChange={setCurriculum}
                  activeModuleId={panel?.mode === "edit" ? panel.moduleId : undefined}
                  onAddModule={() => setPanel({ mode: "create" })}
                  onEditModule={(m) => setPanel({ mode: "edit", moduleId: m.id })}
                  onGenerateAi={ai.openGenerate}
                />
              </div>
              <div className="lg:col-span-4 min-w-0 space-y-5 lg:sticky lg:top-6">
                <AnimatePresence mode="wait" initial={false}>
                  {panel ? (
                    <ModulePanel
                      key={panel.mode === "edit" ? panel.moduleId : "create"}
                      mode={panel.mode}
                      initialValues={panelInitialValues}
                      onCancel={() => setPanel(null)}
                      onSubmit={handlePanelSubmit}
                      onUploadingChange={(uploading) => setUploads((prev) => ({ ...prev, module: uploading }))}
                    />
                  ) : (
                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                      <CoursePreviewCard {...previewProps} onExpand={() => setIsPreviewOpen(true)} />
                      <CreateCourseActions
                        isContinuing={savingIntent === "continue"}
                        disabled={isSaving}
                        cancelLabel="Back"
                        continueLabel="Continue to Pricing"
                        continuingLabel="Saving course..."
                        onCancel={() => set({ step: null })}
                        onContinue={continueToPricing}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          clearCreateCourseDraft();
          router.push("/courses");
        }}
      />
    </FormProvider>
  );
}

export default CreateCourseView;
