"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { gradeSubmission } from "@/lib/assignmentStorage";
import { StudentCell } from "./StudentCell";
import { SubmissionStatusBadges } from "./SubmissionStatusBadges";
import { RubricLevelPicker } from "./RubricLevelPicker";
import { gradeFormSchema, type GradeFormValues } from "./gradeFormSchema";

export interface GradeSubmissionModalProps {
  submission: AssignmentSubmission | null;
  assignment: AssignmentItem;
  onClose: () => void;
  onGraded: (updated: AssignmentSubmission) => void;
}

/** Grade form: rubric level pickers (sum into the score) or a manual score, plus feedback. */
export function GradeSubmissionModal({ submission, assignment, onClose, onGraded }: GradeSubmissionModalProps) {
  const schema = useMemo(() => gradeFormSchema(assignment), [assignment]);
  const useRubric = assignment.rubric.enabled && assignment.rubric.criteria.length > 0;
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { score: undefined, feedback: "", criterionScores: {} },
  });

  useEffect(() => {
    if (!submission) return;
    reset({ score: submission.score ?? (undefined as unknown as number), feedback: submission.feedback, criterionScores: { ...submission.criterionScores } });
  }, [submission, reset]);

  const criterionScores = useWatch({ control, name: "criterionScores" });
  const rubricError = (errors.criterionScores as { message?: string } | undefined)?.message;

  const pickLevel = (criterionId: string, points: number) => {
    const next = { ...criterionScores, [criterionId]: points };
    setValue("criterionScores", next, { shouldValidate: true });
    setValue(
      "score",
      assignment.rubric.criteria.reduce((sum, c) => sum + (next[c.id] ?? 0), 0),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: GradeFormValues) => {
    if (!submission) return;
    const toastId = toast.loading("Saving grade...", { description: `Grading ${submission.student.name}'s submission.` });
    try {
      const updated = await gradeSubmission(submission.id, {
        score: values.score,
        feedback: values.feedback,
        criterionScores: useRubric ? values.criterionScores : undefined,
      });
      toast.success("Grade saved", { id: toastId, description: `${submission.student.name} scored ${values.score} / ${assignment.totalPoints}.` });
      onGraded(updated);
      onClose();
    } catch (error) {
      toast.error("Couldn't save grade", { id: toastId, description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  if (!submission) return null;

  return (
    <ModalShell
      isOpen={Boolean(submission)}
      onClose={isSubmitting ? () => {} : onClose}
      title="Grade Submission"
      subtitle={`${assignment.title} · ${assignment.totalPoints} points`}
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="grade-submission-form" leftIcon={<Check />} isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Grade"}
          </PrimaryButton>
        </>
      }
    >
      <form id="grade-submission-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dash bg-gray-bg p-3.5">
          <StudentCell student={submission.student} />
          <SubmissionStatusBadges submission={submission} />
        </div>

        {useRubric && (
          <div className="space-y-3">
            <p className="body-sm-medium text-primary-500">Rubric</p>
            {assignment.rubric.criteria.map((c) => (
              <RubricLevelPicker
                key={c.id}
                criterion={c}
                value={criterionScores?.[c.id]}
                onChange={(points) => pickLevel(c.id, points)}
                error={Boolean(rubricError) && typeof criterionScores?.[c.id] !== "number"}
              />
            ))}
            {rubricError && <p className="body-xsm-regular text-red">{rubricError}</p>}
          </div>
        )}

        <InputField
          id="grade-score"
          type="number"
          label={useRubric ? "Total Score (from rubric)" : "Score"}
          required
          min={0}
          max={assignment.totalPoints}
          step="any"
          readOnly={useRubric}
          rightElement={<span className="body-sm-regular">/ {assignment.totalPoints}</span>}
          error={errors.score?.message}
          className="no-spinner"
          {...register("score", { valueAsNumber: true })}
        />

        <div>
          <label htmlFor="grade-feedback" className="mb-2 block body-sm-regular text-primary-400">
            Feedback
          </label>
          <TextAreaField id="grade-feedback" rows={4} placeholder="Share what went well and what to improve..." error={errors.feedback?.message} {...register("feedback")} />
        </div>
      </form>
    </ModalShell>
  );
}

export default GradeSubmissionModal;
