"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FormProvider, useFormState, useWatch } from "react-hook-form";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { AssignmentItem } from "@/types/assignment";
import { stepOfField, type AssignmentWizardValues, type WizardStep } from "@/validations/assignmentWizardSchema";
import { wizardCourseContext, wizardCourseTitle, wizardModuleLabel } from "./wizardFormat";
import { WizardHeader } from "./shell/WizardHeader";
import { WizardStepper } from "./shell/WizardStepper";
import { WizardFooter } from "./shell/WizardFooter";
import { WizardStepContent } from "./shell/WizardStepContent";
import { useAssignmentWizard } from "./shell/useAssignmentWizard";
import type { WizardDraft } from "./shell/wizardDraft";
import { useCourseCatalog, useCourseContext } from "@/lib/courseCatalog";

export interface AssignmentWizardViewProps {
  mode: "create" | "edit";
  baseValues: AssignmentWizardValues;
  draft: WizardDraft | null;
  draftKey: string;
  /** Edit mode: the saved assignment. */
  existing?: AssignmentItem;
}

/**
 * Create / Edit Assignment wizard shell: header, 7-step stepper, active step and footer actions.
 * The course context (modules, lessons, title) always follows the form's CURRENT `courseId`.
 */
export function AssignmentWizardView({ mode, baseValues, draft, draftKey, existing }: AssignmentWizardViewProps) {
  const wizard = useAssignmentWizard({ mode, assignmentId: existing?.id, existing, baseValues, draft, draftKey });
  const { form, step } = wizard;
  const [courseId, moduleId] = useWatch({ control: form.control, name: ["courseId", "moduleId"] });
  // Loads the course list and the selected course's modules / lessons from the API.
  useCourseCatalog();
  const loadedContext = useCourseContext(courseId || null);
  const context = useMemo(() => loadedContext ?? wizardCourseContext(courseId ?? ""), [loadedContext, courseId]);
  const { errors } = useFormState({ control: form.control });
  const errorSteps = Array.from(new Set(Object.keys(errors).map((k) => stepOfField(k)))) as WizardStep[];

  const listHref = "/assignments";
  const cancelHref = mode === "edit" && existing ? `/assignments/${existing.id}` : listHref;
  const primaryLabel = step === "review" ? (mode === "edit" ? "Save Changes" : "Create Assignment") : "Save & Continue";

  const footer = (
    <WizardFooter
      backKind={step === "basic" ? "cancel" : "previous"}
      onBack={step === "basic" ? () => wizard.requestLeave(cancelHref) : wizard.previous}
      primaryLabel={primaryLabel}
      onPrimary={() => void wizard.next()}
      isBusy={wizard.busy}
      busyLabel={mode === "edit" ? "Saving..." : "Creating..."}
    />
  );

  return (
    <FormProvider {...form}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-5"
      >
        <WizardHeader
          mode={mode}
          courseTitle={context.course.id ? wizardCourseTitle(context) : ""}
          moduleLabel={wizardModuleLabel(context, moduleId)}
          assignmentId={existing?.id}
          assignmentTitle={existing?.title}
        />
        <WizardStepper
          current={step}
          completed={wizard.completed}
          isReachable={wizard.isReachable}
          errorSteps={errorSteps}
          onSelect={wizard.goToStep}
        />
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <WizardStepContent
            step={step}
            context={context}
            mode={mode}
            footer={footer}
            onGoToStep={wizard.goToStep}
            onUploadingChange={wizard.setUploading}
          />
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={wizard.leaveOpen}
        title="Discard unsaved changes?"
        subtitle={mode === "edit" ? "Your edits haven't been saved yet." : "This assignment hasn't been created yet."}
        message={
          mode === "edit"
            ? "If you leave now, the changes you made to this assignment will be lost."
            : "If you leave now, everything you entered in this wizard will be lost."
        }
        confirmLabel="Discard & Leave"
        pendingLabel="Leaving..."
        confirmIcon={<LogOut className="h-4 w-4" />}
        onClose={wizard.closeLeave}
        onConfirm={wizard.confirmLeave}
      />
    </FormProvider>
  );
}

export default AssignmentWizardView;
