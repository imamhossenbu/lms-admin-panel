"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import { COURSE_SHORT_DESCRIPTION_MAX, COURSE_TITLE_MAX, richTextLength, type CourseBasicInfoInput } from "@/validations/courseSchema";
import { normalizeAiOutline, outlineStats, type AiOutline, type AiOutlineRequest } from "../aiOutline";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

/** Builds a starter full description from the outline summary and outcomes. */
const outlineToHtml = (outline: AiOutline) => {
  const summary = outline.summary ? `<p>${escapeHtml(outline.summary)}</p>` : "";
  const outcomes = outline.learningOutcomes.length
    ? `<ul>${outline.learningOutcomes.map((o) => `<li><p>${escapeHtml(o)}</p></li>`).join("")}</ul>`
    : "";
  return summary + outcomes;
};

const requestDescription = (request: AiOutlineRequest) =>
  [
    request.audience && `Target audience: ${request.audience}.`,
    request.goals && `Goals: ${request.goals}.`,
    `Language: ${request.language}.`,
    `Duration: ${request.durationWeeks} weeks with ${request.moduleCount} modules and ${request.lessonsPerModule} lessons per module.`,
  ]
    .filter(Boolean)
    .join(" ");

/**
 * Generate modal → Review modal → accepted outline. The accepted outline is
 * saved as modules/lessons after the course is created.
 */
export function useCourseAiFlow(form: UseFormReturn<CourseBasicInfoInput>) {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [draftOutline, setDraftOutline] = useState<AiOutline | null>(null);
  const [lastRequest, setLastRequest] = useState<AiOutlineRequest | null>(null);
  const [acceptedOutline, setAcceptedOutline] = useState<AiOutline | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const buildInitialValues = (): Partial<AiOutlineRequest> => {
    if (lastRequest) return lastRequest;
    const { title, level, language, shortDescription } = form.getValues();
    return {
      topic: title.trim(),
      level,
      language,
      ...(shortDescription.trim() ? { audience: shortDescription.trim() } : {}),
    };
  };
  const [initialValues, setInitialValues] = useState<Partial<AiOutlineRequest>>({});

  const openGenerate = () => {
    setInitialValues(buildInitialValues());
    setIsGenerateOpen(true);
  };

  const handleGenerated = (outline: AiOutline, request: AiOutlineRequest) => {
    setIsGenerateOpen(false);
    setLastRequest(request);
    setDraftOutline(outline);
    setIsReviewOpen(true);
  };

  const handleRegenerate = async () => {
    if (!lastRequest || isRegenerating) return;
    setIsRegenerating(true);
    const toastId = toast.loading("Regenerating curriculum...", {
      description: `Creating a fresh outline for "${lastRequest.topic}".`,
    });
    try {
      const raw = await aiApi.generateCourseOutline({
        title: lastRequest.topic,
        description: requestDescription(lastRequest),
        level: lastRequest.level,
      });
      const outline = normalizeAiOutline(raw, lastRequest);
      if (!outline.modules.length) throw new Error("Empty outline");
      setDraftOutline(outline);
      const stats = outlineStats(outline);
      toast.success("New curriculum generated", {
        id: toastId,
        description: `${stats.moduleCount} modules and ${stats.lessonCount} lessons are ready to review.`,
      });
    } catch (err) {
      toast.error("Couldn't regenerate the curriculum", {
        id: toastId,
        description: apiErrorMessage(err, "The AI service didn't respond. Please try again in a moment."),
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditDetails = () => {
    setIsReviewOpen(false);
    setInitialValues(buildInitialValues());
    setIsGenerateOpen(true);
  };

  const handleAddToCurriculum = (outline: AiOutline) => {
    setAcceptedOutline(outline);
    setDraftOutline(outline);
    setIsReviewOpen(false);

    const opts = { shouldDirty: true, shouldValidate: true } as const;
    const values = form.getValues();
    if (!values.title.trim() && outline.title) form.setValue("title", truncate(outline.title, COURSE_TITLE_MAX), opts);
    if (!values.shortDescription.trim() && outline.summary) {
      form.setValue("shortDescription", truncate(outline.summary, COURSE_SHORT_DESCRIPTION_MAX), opts);
    }
    if (!richTextLength(values.description)) {
      const html = outlineToHtml(outline);
      if (html) form.setValue("description", html, opts);
    }
    form.setValue("level", outline.level, opts);

    const stats = outlineStats(outline);
    toast.success("AI curriculum added", {
      description: `${stats.moduleCount} modules and ${stats.lessonCount} lessons will be saved with this course.`,
    });
  };

  const viewAccepted = () => {
    if (!acceptedOutline) return;
    setDraftOutline(acceptedOutline);
    setIsReviewOpen(true);
  };

  const removeAccepted = () => {
    setAcceptedOutline(null);
    toast.success("AI curriculum removed", { description: "You can generate a new one at any time." });
  };

  return {
    acceptedOutline,
    generateModal: {
      isOpen: isGenerateOpen,
      onClose: () => setIsGenerateOpen(false),
      initialValues,
      onGenerated: handleGenerated,
    },
    reviewModal: {
      isOpen: isReviewOpen,
      outline: draftOutline,
      isRegenerating,
      onClose: () => setIsReviewOpen(false),
      onChange: setDraftOutline,
      onRegenerate: () => void handleRegenerate(),
      onEditDetails: handleEditDetails,
      onAddToCurriculum: handleAddToCurriculum,
    },
    openGenerate,
    viewAccepted,
    removeAccepted,
  };
}
