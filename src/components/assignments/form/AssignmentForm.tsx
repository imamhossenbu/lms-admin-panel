"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { AssignmentItem } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { assignmentFormSchema, type AssignmentFormValues } from "@/validations/assignmentSchema";
import { createAssignment, updateAssignment } from "@/lib/assignmentStorage";
import { useLeaveGuard } from "@/components/courses/lesson-editor/hooks/useLeaveGuard";
import { createAssignmentSchema, type AssignmentFormMode } from "./assignmentFormConfig";
import { useAssignmentDraft } from "./useAssignmentDraft";
import { AssignmentFormHeader } from "./AssignmentFormHeader";
import { BasicInfoCard } from "./BasicInfoCard";
import { AttachmentsCard } from "./AttachmentsCard";
import { AssignmentSettingsCard } from "./AssignmentSettingsCard";
import { GradingOptionsCard } from "./GradingOptionsCard";
import { VisibilityCard } from "./VisibilityCard";
import { LeaveAssignmentModal } from "./LeaveAssignmentModal";

export interface AssignmentFormProps {
  mode: AssignmentFormMode;
  context: LessonEditorContext;
  initialValues: AssignmentFormValues;
  /** Edit mode only. */
  assignment?: AssignmentItem;
}

const friendly = (error: unknown) => (error instanceof Error && error.message ? error.message : "Something went wrong. Please try again.");

/** The Create / Edit Assignment form (two-column layout from the design). */
export function AssignmentForm({ mode, context, initialValues, assignment }: AssignmentFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(mode === "create" ? createAssignmentSchema : assignmentFormSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });
  const { handleSubmit, reset, formState } = form;
  const { isDirty, isSubmitting } = formState;

  const draftKey = mode === "create" ? `create_${context.course.id}` : `edit_${assignment?.id ?? ""}`;
  const clearDraft = useAssignmentDraft(form, draftKey);
  const leave = useLeaveGuard(isDirty);

  const onValid = async (values: AssignmentFormValues) => {
    if (isUploading) {
      toast.warning("Uploads still running", { description: "Wait for your files to finish uploading, then save again." });
      return;
    }
    const toastId = toast.loading(mode === "create" ? "Creating assignment..." : "Saving changes...", { description: values.title });
    try {
      const saved =
        mode === "create" || !assignment
          ? await createAssignment(values, context.course.id)
          : await updateAssignment(assignment.id, { ...values, rubric: { ...assignment.rubric, enabled: values.showRubric } });
      clearDraft();
      reset(values);
      toast.success(mode === "create" ? "Assignment created" : "Assignment updated", {
        id: toastId,
        description: values.status === "PUBLISHED" ? `"${saved.title}" is visible to students.` : `"${saved.title}" was saved as a draft.`,
      });
      router.push(`/assignments/${saved.id}`);
    } catch (error) {
      toast.error(mode === "create" ? "Could not create assignment" : "Could not save changes", { id: toastId, description: friendly(error) });
    }
  };

  const onInvalid = () =>
    toast.error("Please fix the highlighted fields", { description: "Some required details are missing or invalid." });

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit(onValid, onInvalid)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <AssignmentFormHeader
        mode={mode}
        courseId={context.course.id}
        courseTitle={context.course.title}
        assignment={assignment ? { id: assignment.id, title: assignment.title } : undefined}
        isSaving={isSubmitting}
        isUploading={isUploading}
        onBack={() => leave.navigate("/assignments")}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">
        <div className="xl:col-span-3 space-y-5 min-w-0">
          <BasicInfoCard form={form} context={context} />
          <AttachmentsCard form={form} onUploadingChange={setIsUploading} />
        </div>
        <div className="xl:col-span-2 space-y-5 min-w-0">
          <AssignmentSettingsCard form={form} />
          <GradingOptionsCard form={form} />
          <VisibilityCard form={form} />
        </div>
      </div>

      <LeaveAssignmentModal
        isOpen={leave.isConfirmOpen}
        onClose={leave.cancelLeave}
        onConfirm={async () => {
          clearDraft();
          await leave.confirmLeave();
        }}
      />
    </motion.form>
  );
}

export default AssignmentForm;
