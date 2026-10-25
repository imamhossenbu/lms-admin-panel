"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { OutlineLessonInput, OutlineModuleInput } from "@/validations/courseOutlineSchema";
import { outlineStats, type AiOutline } from "./aiOutline";
import { OutlineCourseCard } from "./outline/OutlineCourseCard";
import { OutlineModuleList } from "./outline/OutlineModuleList";
import { OutlineSummaryPanel } from "./outline/OutlineSummaryPanel";
import { OutlineValidationBanner } from "./outline/OutlineValidationBanner";
import { OutlineModalFooter } from "./outline/OutlineModalFooter";
import { ModuleFormModal } from "./outline/ModuleFormModal";
import { LessonFormModal } from "./outline/LessonFormModal";
import * as edit from "./outline/outlineEditing";

export interface AiOutlineReviewModalProps {
  isOpen: boolean;
  outline: AiOutline | null;
  /** Course thumbnail for the header card (falls back to a placeholder). */
  thumbnailUrl?: string;
  /** True while the parent is regenerating; show a loading state on Regenerate. */
  isRegenerating?: boolean;
  onClose: () => void;
  /** Every edit (module/lesson add, edit, delete, reorder) reports the new outline. */
  onChange: (outline: AiOutline) => void;
  /** "Regenerate" — parent re-runs generation with the last request. */
  onRegenerate: () => void;
  /** "Edit Details" / "Edit with AI" — parent reopens the Generate form. */
  onEditDetails: () => void;
  /** "Add to Curriculum" — parent stores the outline for saving with the course. */
  onAddToCurriculum: (outline: AiOutline) => void;
}

type OutlineDialog =
  | { kind: "module"; moduleId?: string }
  | { kind: "lesson"; moduleId: string; lessonId?: string }
  | { kind: "deleteModule"; moduleId: string }
  | null;

export function AiOutlineReviewModal({
  isOpen,
  outline,
  thumbnailUrl,
  isRegenerating = false,
  onClose,
  onChange,
  onRegenerate,
  onEditDetails,
  onAddToCurriculum,
}: AiOutlineReviewModalProps) {
  const [dialog, setDialog] = useState<OutlineDialog>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  /** Explicit expand/collapse choices; modules without one fall back to "first module open". */
  const [expandOverrides, setExpandOverrides] = useState<Record<string, boolean>>({});
  const [showIssues, setShowIssues] = useState(false);

  // Latest outline for async callbacks (toast "Undo").
  const outlineRef = useRef(outline);
  useEffect(() => {
    outlineRef.current = outline;
  }, [outline]);

  const base = outline ?? edit.EMPTY_OUTLINE;
  const modules = base.modules;
  const stats = useMemo(() => outlineStats(base), [base]);
  const issues = useMemo(() => edit.getOutlineIssues(outline), [outline]);
  const visibleIssues = showIssues ? issues : { messages: [], invalidModuleIds: new Set<string>() };

  const firstModuleId = modules[0]?.id;
  const isExpanded = (moduleId: string) =>
    isEditMode || (expandOverrides[moduleId] ?? moduleId === firstModuleId);
  const toggleModule = (moduleId: string) =>
    setExpandOverrides((prev) => ({ ...prev, [moduleId]: !isExpanded(moduleId) }));

  const dialogModule = dialog ? modules.find((m) => m.id === dialog.moduleId) : undefined;
  const dialogLesson =
    dialog?.kind === "lesson" && dialog.lessonId ? dialogModule?.lessons.find((l) => l.id === dialog.lessonId) : undefined;
  const moduleFormInitial = useMemo(
    () => (dialog?.kind === "module" && dialogModule ? edit.moduleToForm(dialogModule) : undefined),
    [dialog?.kind, dialogModule]
  );
  const lessonFormInitial = useMemo(() => (dialogLesson ? edit.lessonToForm(dialogLesson) : undefined), [dialogLesson]);

  const closeDialog = () => setDialog(null);

  const handleClose = () => {
    setDialog(null);
    setShowIssues(false);
    setIsEditMode(false);
    onClose();
  };

  /* ---------- Module actions ---------- */

  const submitModule = (values: OutlineModuleInput) => {
    if (dialog?.kind !== "module") return;
    if (dialog.moduleId) {
      onChange(edit.updateModule(base, dialog.moduleId, values));
      toast.success("Module updated", { description: values.title });
    } else {
      const result = edit.addModule(base, values);
      onChange(result.outline);
      setExpandOverrides((prev) => ({ ...prev, [result.moduleId]: true }));
      toast.success("Module added", { description: values.title });
    }
    closeDialog();
  };

  const confirmDeleteModule = async () => {
    if (dialog?.kind !== "deleteModule" || !dialogModule) return;
    onChange(edit.removeModule(base, dialogModule.id));
    toast.success("Module deleted", { description: dialogModule.title });
  };

  /* ---------- Lesson actions ---------- */

  const submitLesson = (values: OutlineLessonInput) => {
    if (dialog?.kind !== "lesson") return;
    if (dialog.lessonId) {
      onChange(edit.updateLesson(base, dialog.moduleId, dialog.lessonId, values));
      toast.success("Lesson updated", { description: values.title });
    } else {
      onChange(edit.addLesson(base, dialog.moduleId, values));
      toast.success("Lesson added", { description: values.title });
    }
    closeDialog();
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const target = modules.find((m) => m.id === moduleId);
    const index = target?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
    if (!target || index < 0) return;
    const lesson = target.lessons[index];
    onChange(edit.removeLesson(base, moduleId, lessonId));
    toast.success("Lesson deleted", {
      description: lesson.title,
      action: {
        label: "Undo",
        onClick: () => {
          const current = outlineRef.current;
          if (!current?.modules.some((m) => m.id === moduleId)) {
            toast.error("Could not restore lesson", { description: "Its module is no longer in the outline." });
            return;
          }
          onChange(edit.restoreLesson(current, moduleId, lesson, index));
        },
      },
    });
  };

  /* ---------- Footer ---------- */

  const handleAddToCurriculum = () => {
    if (!outline || issues.messages.length > 0) {
      setShowIssues(true);
      toast.error("Outline is incomplete", { description: "Fix the highlighted items before adding it to your curriculum." });
      return;
    }
    setShowIssues(false);
    onAddToCurriculum(outline);
  };

  const toggleEditMode = () => setIsEditMode((value) => !value);

  return (
    <>
      <ModalShell
        isOpen={isOpen}
        // Sub-dialogs handle Escape themselves; don't close the whole review behind them.
        onClose={dialog ? () => {} : handleClose}
        title="AI Generated Outline"
        titleIcon={<Sparkles className="text-purple" />}
        headerVariant="hero"
        subtitle="Review and edit the generated course structure. You can customize modules, lessons, and lesson types before adding it to your curriculum."
        maxWidth="2xl"
        bodyClassName="bg-white"
        headerActions={
          <SecondaryButton
            type="button"
            onClick={onRegenerate}
            isLoading={isRegenerating}
            disabled={isRegenerating}
            leftIcon={<RefreshCw />}
          >
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </SecondaryButton>
        }
        footer={
          <OutlineModalFooter
            isEditMode={isEditMode}
            disabled={isRegenerating}
            onCancel={handleClose}
            onEditWithAi={onEditDetails}
            onToggleEditMode={toggleEditMode}
            onAddToCurriculum={handleAddToCurriculum}
          />
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
            {outline && (
              <OutlineCourseCard
                title={outline.title}
                summary={outline.summary}
                moduleCount={stats.moduleCount}
                lessonCount={stats.lessonCount}
                durationWeeks={outline.durationWeeks}
                thumbnailUrl={thumbnailUrl}
                onEditDetails={onEditDetails}
              />
            )}

            <OutlineValidationBanner issues={visibleIssues.messages} />

            <OutlineModuleList
              modules={modules}
              isExpanded={isExpanded}
              isEditMode={isEditMode}
              isRegenerating={isRegenerating}
              invalidModuleIds={visibleIssues.invalidModuleIds}
              onToggle={toggleModule}
              onReorderModules={(next) => onChange(edit.reorderModules(base, next))}
              onAddModule={() => setDialog({ kind: "module" })}
              onEditModule={(module) => setDialog({ kind: "module", moduleId: module.id })}
              onDeleteModule={(module) => setDialog({ kind: "deleteModule", moduleId: module.id })}
              onAddLesson={(module) => setDialog({ kind: "lesson", moduleId: module.id })}
              onEditLesson={(module, lesson) => setDialog({ kind: "lesson", moduleId: module.id, lessonId: lesson.id })}
              onDeleteLesson={(module, lesson) => deleteLesson(module.id, lesson.id)}
              onReorderLessons={(moduleId, lessons) => onChange(edit.reorderLessons(base, moduleId, lessons))}
            />
          </div>

          <div className="min-w-0 lg:col-span-4">
            <OutlineSummaryPanel stats={stats} durationWeeks={base.durationWeeks} />
          </div>
        </div>
      </ModalShell>

      <ModuleFormModal
        isOpen={isOpen && dialog?.kind === "module"}
        initialValues={moduleFormInitial}
        onClose={closeDialog}
        onSubmit={submitModule}
      />

      <LessonFormModal
        isOpen={isOpen && dialog?.kind === "lesson"}
        moduleTitle={dialogModule?.title}
        initialValues={lessonFormInitial}
        onClose={closeDialog}
        onSubmit={submitLesson}
      />

      <ConfirmModal
        isOpen={isOpen && dialog?.kind === "deleteModule"}
        title="Delete Module"
        message={
          dialogModule ? (
            <>
              Delete <span className="font-semibold">&ldquo;{dialogModule.title}&rdquo;</span>
              {dialogModule.lessons.length > 0
                ? ` and its ${dialogModule.lessons.length} ${dialogModule.lessons.length === 1 ? "lesson" : "lessons"}`
                : ""}{" "}
              from the outline?
            </>
          ) : (
            "Delete this module from the outline?"
          )
        }
        confirmLabel="Delete Module"
        confirmIcon={<Trash2 />}
        onClose={closeDialog}
        onConfirm={confirmDeleteModule}
      />
    </>
  );
}

export default AiOutlineReviewModal;
