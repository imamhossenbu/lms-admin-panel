"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { aiApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import { AI_LEVEL_OPTIONS, courseAiSchema, type CourseAiFormInput } from "@/validations/courseAiSchema";
import { AiOutline, AiOutlineRequest, normalizeAiOutline } from "./aiOutline";
import { AiGenerateForm } from "./ai/AiGenerateForm";
import { AiBenefitsPanel } from "./ai/AiBenefitsPanel";
import { AiGenerationProgress, AI_GENERATION_STEPS } from "./ai/AiGenerationProgress";

export interface GenerateCourseAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Prefill from the Basic Information form (title → topic, level, language...). */
  initialValues?: Partial<AiOutlineRequest>;
  /** Called after a successful generation with the normalized outline. Parent closes this modal. */
  onGenerated: (outline: AiOutline, request: AiOutlineRequest) => void;
}

const STEP_INTERVAL_MS = 1200;
const FINISH_STEP_MS = 250;
const TOTAL_STEPS = AI_GENERATION_STEPS.length;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDefaults = (initial?: Partial<AiOutlineRequest>): CourseAiFormInput => ({
  topic: initial?.topic ?? "",
  audience: initial?.audience ?? "",
  level: initial?.level ?? "BEGINNER",
  language: initial?.language || "English",
  goals: initial?.goals ?? "",
  durationWeeks: initial?.durationWeeks || 8,
  moduleCount: initial?.moduleCount || 6,
  lessonsPerModule: initial?.lessonsPerModule ?? "4 - 6",
});

const toRequest = (values: CourseAiFormInput): AiOutlineRequest => ({
  topic: values.topic.trim(),
  audience: values.audience.trim(),
  level: values.level,
  language: values.language,
  goals: values.goals?.trim() || undefined,
  durationWeeks: values.durationWeeks,
  moduleCount: values.moduleCount,
  lessonsPerModule: values.lessonsPerModule,
});

/** Turns the form into a clear instruction for the outline endpoint. */
const buildInstruction = (request: AiOutlineRequest) => {
  const levelLabel = AI_LEVEL_OPTIONS.find((o) => o.value === request.level)?.label ?? request.level;
  return [
    `Create a ${levelLabel.toLowerCase()} level course about "${request.topic}", taught in ${request.language}.`,
    `Target audience: ${request.audience}.`,
    request.goals ? `Learning goals: ${request.goals}.` : null,
    `Course duration: ${request.durationWeeks} weeks.`,
    `Generate exactly ${request.moduleCount} modules with ${request.lessonsPerModule} lessons per module.`,
    "For every module give a title and a short description. For every lesson give a title, a one-sentence summary, a lesson type (VIDEO, TEXT, CODING, QUIZ, ASSIGNMENT or LIVE) and an estimated duration in minutes.",
    `Write all titles and descriptions in ${request.language}.`,
  ]
    .filter(Boolean)
    .join(" ");
};

/** Inner content — mounted only while open, so every opening starts with a fresh form prefilled from `initialValues`. */
function GenerateCourseAiContent({ onClose, initialValues, onGenerated }: Omit<GenerateCourseAiModalProps, "isOpen">) {
  const formId = useId();
  const form = useForm<CourseAiFormInput>({
    resolver: zodResolver(courseAiSchema),
    mode: "onTouched",
    defaultValues: buildDefaults(initialValues),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const completedRef = useRef(0);
  const runIdRef = useRef(0);
  const toastIdRef = useRef<string | number | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const setStep = useCallback((value: number) => {
    completedRef.current = value;
    setCompleted(value);
  }, []);

  // Advance the steps on a timer while waiting; the last step stays "current" until the API answers.
  useEffect(() => {
    if (!isGenerating || isFinishing) return;
    const timer = setInterval(() => {
      if (completedRef.current < TOTAL_STEPS - 1) setStep(completedRef.current + 1);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isGenerating, isFinishing, setStep]);

  const handleClose = () => {
    // Discard any in-flight result.
    runIdRef.current += 1;
    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    onClose();
  };

  const onSubmit = async (values: CourseAiFormInput) => {
    if (isGenerating) return;
    const runId = ++runIdRef.current;
    const isCurrent = () => aliveRef.current && runIdRef.current === runId;
    const request = toRequest(values);

    setStep(0);
    setIsFinishing(false);
    setIsGenerating(true);
    const toastId = toast.loading("Generating course outline...", {
      description: "AI is building modules and lessons for your course.",
    });
    toastIdRef.current = toastId;

    try {
      const raw = await aiApi.generateCourseOutline({
        title: request.topic,
        description: buildInstruction(request),
        level: request.level,
      });
      if (!isCurrent()) return;

      const outline = normalizeAiOutline(raw, request);
      if (outline.modules.length === 0) throw new Error("EMPTY_OUTLINE");

      // Finish the remaining steps quickly before handing over.
      setIsFinishing(true);
      while (completedRef.current < TOTAL_STEPS) {
        await wait(FINISH_STEP_MS);
        if (!isCurrent()) return;
        setStep(completedRef.current + 1);
      }
      await wait(FINISH_STEP_MS);
      if (!isCurrent()) return;

      const lessonCount = outline.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      toast.success("Course outline ready", {
        id: toastId,
        description: `${outline.modules.length} modules and ${lessonCount} lessons generated. Review them before adding.`,
      });
      toastIdRef.current = null;
      onGenerated(outline, request);
    } catch (error) {
      if (!isCurrent()) return;
      const description =
        error instanceof Error && error.message === "EMPTY_OUTLINE"
          ? "The AI did not return any modules. Try adding more detail and generate again."
          : apiErrorMessage(error, "The AI service is unavailable right now. Please try again in a moment.");
      toast.error("Could not generate outline", { id: toastId, description });
      toastIdRef.current = null;
      setIsGenerating(false);
      setIsFinishing(false);
      setStep(0);
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={handleClose}
      title="Generate Course with AI"
      subtitle={
        isGenerating
          ? "Hang tight, this usually takes a few seconds."
          : "Create a complete course outline in seconds with AI. Just provide a few details and we'll generate modules, lessons and suggested content for you."
      }
      maxWidth="xl"
      footer={
        isGenerating ? undefined : (
          <>
            <SecondaryButton type="button" onClick={handleClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form={formId}
              leftIcon={<Sparkles />}
              rightIcon={<ArrowRight />}
              disabled={form.formState.isSubmitting}
            >
              Generate Course Outline
            </PrimaryButton>
          </>
        )
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <AiGenerationProgress completed={completed} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <AiGenerateForm formId={formId} form={form} onSubmit={onSubmit} />
            <AiBenefitsPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </ModalShell>
  );
}

export function GenerateCourseAiModal({ isOpen, ...props }: GenerateCourseAiModalProps) {
  if (!isOpen) return null;
  return <GenerateCourseAiContent {...props} />;
}

export default GenerateCourseAiModal;
