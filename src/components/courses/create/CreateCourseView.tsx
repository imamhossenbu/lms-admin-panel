"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useUrlParams } from "@/lib/useUrlParams";
import { courseBasicInfoSchema, type CourseBasicInfoInput } from "@/validations/courseSchema";
import {
  ADDITIONAL_SETTINGS_FIELDS,
  coursePublishSchema,
  EMPTY_COURSE_PUBLISH,
  PRICING_FIELDS,
  type CoursePublishInput,
} from "@/validations/coursePublishSchema";
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
import { CREATE_COURSE_STEPS, EMPTY_BASIC_INFO, levelLabel, listItemsFromHtml, slugify } from "./createCourseOptions";
import { outlineStats, type AiOutline } from "./aiOutline";
import { useCreateCourseData } from "./hooks/useCreateCourseData";
import { useCourseAiFlow } from "./hooks/useCourseAiFlow";
import { usePreviewTab } from "./hooks/usePreviewTab";
import { useSaveCourse, type SaveIntent } from "./hooks/useSaveCourse";
import { editDraftKey, useCreateCourseDraft, type StoredDraft } from "./hooks/useCreateCourseDraft";
import { useEditCourseSource } from "./edit/useEditCourseSource";
import { CourseNotFoundState } from "./edit/CourseNotFoundState";
import type { CoursePreviewData } from "./preview/previewTypes";
import { PricingStep } from "./steps/PricingStep";
import { AdditionalSettingsStep } from "./steps/AdditionalSettingsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { STEP_PARAM, stepFrontier, stepFromParam, type CourseStepFacts, type CourseStepNumber } from "./steps/stepTypes";

type ModulePanelState = { mode: "create" } | { mode: "edit"; moduleId: string } | null;

/** Create Course wizard: Basic Information → Curriculum → Pricing & Access → Additional Settings → Review & Publish. */
export interface CreateCourseViewProps {
  /** When given, the wizard edits this existing course instead of creating a new one. */
  courseId?: string;
}

export function CreateCourseView({ courseId }: CreateCourseViewProps = {}) {
  const isEdit = Boolean(courseId);
  const router = useRouter();
  const { get, set } = useUrlParams();
  const hasStepParam = Boolean(get("step"));
  const step = stepFromParam(get("step"));

  const { categories, instructors, isLoading, addCategory } = useCreateCourseData();
  const [previewTab, setPreviewTab] = usePreviewTab();
  const { save, update, savingIntent } = useSaveCourse();
  const source = useEditCourseSource(courseId);
  const draftKey = courseId ? editDraftKey(courseId) : undefined;
  const serverDraft = useMemo<StoredDraft | null>(
    () =>
      source.initial
        ? { values: source.initial.basic, curriculum: source.initial.outline, publish: source.initial.publish }
        : null,
    [source.initial]
  );

  const form = useForm<CourseBasicInfoInput>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: EMPTY_BASIC_INFO,
    mode: "onTouched",
  });
  const publishForm = useForm<CoursePublishInput>({
    resolver: zodResolver(coursePublishSchema),
    defaultValues: EMPTY_COURSE_PUBLISH,
    mode: "onTouched",
  });
  const ai = useCourseAiFlow(form);
  const values = useWatch({ control: form.control }) as CourseBasicInfoInput;
  const { isRestored, completedSteps, markStepCompleted, resumeStep, clearDraft } = useCreateCourseDraft(
    form,
    publishForm,
    ai.acceptedOutline,
    ai.setAcceptedOutline,
    !isLoading && (!isEdit || Boolean(serverDraft)),
    isEdit ? { storageKey: draftKey, initial: serverDraft, currentStep: step } : { currentStep: step }
  );

  // Create mode: steps unlock one by one (a step is reachable up to the first unfinished one).
  // Edit mode: the course already exists, so every step is reachable.
  const frontier: CourseStepNumber = isEdit ? 5 : stepFrontier(completedSteps);
  const isStepReachable = (target: number) => target <= frontier;

  const [instructorId, setInstructorId] = useState("");
  const [uploads, setUploads] = useState({ thumbnail: false, video: false, module: false });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [panel, setPanel] = useState<ModulePanelState>(null);

  const isUploading = uploads.thumbnail || uploads.video || uploads.module;
  const isSaving = savingIntent !== null;
  const instructor = instructors.find((i) => i.id === instructorId) ?? instructors[0] ?? null;
  const curriculum: AiOutline = ai.acceptedOutline ?? { ...EMPTY_OUTLINE, title: values.title ?? "", level: values.level ?? "BEGINNER" };

  const goToStep = (target: CourseStepNumber) => {
    set({ step: STEP_PARAM[target] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Coming back without ?step resumes where the user left off; a ?step past the frontier
  // (bookmark, typed URL, stale link) is sent back to the first unfinished step.
  const resumedRef = useRef(false);
  useEffect(() => {
    if (!isRestored) return;
    if (!resumedRef.current) {
      resumedRef.current = true;
      const resumeTo = resumeStep ? (Math.min(resumeStep, frontier) as CourseStepNumber) : 1;
      if (!hasStepParam && resumeTo > 1) {
        set({ step: STEP_PARAM[resumeTo] });
        return;
      }
    }
    if (step > frontier) {
      set({ step: STEP_PARAM[frontier] });
      toast.info("Finish the previous steps first", {
        description: `Complete "${CREATE_COURSE_STEPS[frontier - 1].title}" to unlock the next steps.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestored, step, frontier]);

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
      let publish: CoursePublishInput | null = publishForm.getValues();
      if (intent === "publish") {
        const issues = getOutlineIssues(curriculum).messages;
        if (issues.length) {
          toast.error("Curriculum isn't ready yet", { description: issues.slice(0, 3).join(" ") });
          goToStep(2);
          return;
        }
        if (!(await publishForm.trigger())) {
          toast.error("Please review the pricing and settings", { description: "Some options are missing or invalid." });
          goToStep(publishForm.getFieldState("price").invalid || publishForm.getFieldState("accessDays").invalid ? 3 : 4);
          return;
        }
      } else if (!coursePublishSchema.safeParse(publish).success) {
        publish = null; // draft: fall back to a free course rather than blocking on step 3
      }
      const savedId =
        isEdit && source.snapshot
          ? await update(source.snapshot, data, curriculum, intent, publish)
          : await save(data, ai.acceptedOutline, intent, publish);
      if (!savedId) return;
      clearDraft();
      form.reset(data);
      router.push(intent === "draft" && !isEdit ? "/courses" : `/courses/${savedId}`);
    }, step > 1 ? () => { set({ step: null }); invalidFormToast(); } : invalidFormToast)();
  };

  const goToCurriculum = () => {
    if (isUploading) {
      toast.error("Upload in progress", { description: "Please wait for your media to finish uploading." });
      return;
    }
    void form.handleSubmit(() => {
      markStepCompleted(1);
      goToStep(2);
    }, invalidFormToast)();
  };

  const continueToPricing = () => {
    const issues = getOutlineIssues(curriculum);
    if (issues.messages.length) {
      toast.error("Curriculum isn't ready yet", { description: issues.messages.slice(0, 3).join(" ") });
      return;
    }
    markStepCompleted(2);
    goToStep(3);
  };

  /** Validates the current step's fields, marks it completed and moves on. */
  const continueFrom = async (fields: readonly (keyof CoursePublishInput)[], current: CourseStepNumber, next: CourseStepNumber) => {
    if (await publishForm.trigger(fields as (keyof CoursePublishInput)[])) {
      markStepCompleted(current);
      goToStep(next);
    } else toast.error("Please fix the highlighted fields", { description: "Some options are missing or invalid." });
  };

  const continueFromSettings = async () => {
    const basicOk = await form.trigger(["categoryId", "language", "level"]);
    if (!basicOk) {
      toast.error("Please fix the highlighted fields", { description: "Category, language and level are required." });
      return;
    }
    await continueFrom(ADDITIONAL_SETTINGS_FIELDS, 4, 5);
  };

  const stats = outlineStats(curriculum);
  const facts: CourseStepFacts = {
    title: previewData.title,
    shortDescription: previewData.shortDescription,
    thumbnail: previewData.thumbnail || undefined,
    categoryName: previewData.categoryName,
    language: previewData.language,
    levelLabel: previewData.levelLabel,
    moduleCount: stats.moduleCount,
    lessonCount: stats.lessonCount,
    totalMinutes: stats.totalMinutes,
    learnItems: previewData.learnItems,
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
    if (isEdit) setIsDiscardOpen(true);
    else if (form.formState.isDirty || ai.acceptedOutline) setIsDiscardOpen(true);
    else router.push("/courses");
  };

  const exitPath = isEdit ? `/courses/${courseId}` : "/courses";

  if (isEdit && source.notFound) return <CourseNotFoundState />;
  if (isLoading || source.isLoading || !isRestored) return <CourseCreateSkeleton />;

  return (
    <FormProvider {...form}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="space-y-5 text-left pb-10"
      >
        <CreateCourseHeader
          isSavingDraft={savingIntent === (isEdit ? "save" : "draft")}
          disabled={isSaving}
          onSaveDraft={() => submit(isEdit ? "save" : "draft")}
          onPreview={() => setIsPreviewOpen(true)}
          onPublish={step === 5 ? () => submit("publish") : undefined}
          isPublishing={savingIntent === "publish"}
          {...(isEdit
            ? {
                title: "Edit Course",
                subtitle: "Update your course details, curriculum, pricing and settings.",
                breadcrumbLabel: "Edit Course",
                draftLabel: "Save Changes",
                publishLabel: "Update & Publish",
              }
            : {})}
        />

        <CourseStepper
          activeStep={step}
          isStepReachable={isStepReachable}
          completedSteps={completedSteps}
          onStepClick={(target) => isStepReachable(target) && goToStep(target as CourseStepNumber)}
        />

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
          ) : step === 3 ? (
            <FormProvider key="pricing" {...publishForm}>
              <PricingStep
                facts={facts}
                onBack={() => goToStep(2)}
                onNext={() => void continueFrom(PRICING_FIELDS, 3, 4)}
                onEditBasics={() => goToStep(1)}
              />
            </FormProvider>
          ) : step === 4 ? (
            <FormProvider key="settings" {...publishForm}>
              <AdditionalSettingsStep
                facts={facts}
                settings={{
                  categories,
                  categoryId: values.categoryId ?? "",
                  language: values.language ?? "",
                  level: values.level ?? "",
                  onCategoryChange: (id) => form.setValue("categoryId", id, { shouldDirty: true, shouldValidate: true }),
                  onLanguageChange: (lang) => form.setValue("language", lang, { shouldDirty: true, shouldValidate: true }),
                  onLevelChange: (level) => form.setValue("level", level, { shouldDirty: true, shouldValidate: true }),
                  onCategoryCreated: (c) => addCategory({ ...c, slug: slugify(c.name) }),
                  errors: {
                    categoryId: form.formState.errors.categoryId?.message,
                    language: form.formState.errors.language?.message,
                    level: form.formState.errors.level?.message,
                  },
                }}
                onBack={() => goToStep(3)}
                onNext={() => void continueFromSettings()}
                onEditBasics={() => goToStep(1)}
              />
            </FormProvider>
          ) : step === 5 ? (
            <FormProvider key="review" {...publishForm}>
              <ReviewStep
                facts={facts}
                issues={getOutlineIssues(curriculum).messages}
                isPublishing={savingIntent === "publish"}
                disabled={isSaving}
                onBack={() => goToStep(4)}
                onPublish={() => submit("publish")}
                onEditStep={goToStep}
                onViewCourse={() => setIsPreviewOpen(true)}
                publishLabel={isEdit ? "Update & Publish" : "Publish Course"}
              />
            </FormProvider>
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
                        isContinuing={false}
                        disabled={isSaving}
                        cancelLabel="Back"
                        continueLabel="Continue to Pricing"
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
        title={isEdit ? "Discard your changes?" : "Discard this course?"}
        subtitle="Your unsaved changes will be lost."
        message={
          isEdit
            ? "Any changes you haven't saved will be discarded and the course will stay as it is."
            : "You have unsaved course details. Leaving now will discard everything you've entered on this page."
        }
        confirmLabel="Discard & Leave"
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={async () => {
          clearDraft();
          router.push(exitPath);
        }}
      />
    </FormProvider>
  );
}

export default CreateCourseView;
