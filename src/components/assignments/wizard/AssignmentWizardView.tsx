"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormProvider, useFormState, useWatch } from "react-hook-form";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { AssignmentItem } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { stepOfField, type AssignmentWizardValues, type WizardStep } from "@/validations/assignmentWizardSchema";
import { wizardModuleLabel } from "./wizardFormat";
import { WizardHeader } from "./shell/WizardHeader";
import { WizardStepper } from "./shell/WizardStepper";
import { WizardFooter } from "./shell/WizardFooter";
import { WizardStepContent } from "./shell/WizardStepContent";
import { useAssignmentWizard } from "./shell/useAssignmentWizard";
import type { WizardDraft } from "./shell/wizardDraft";

export interface AssignmentWizardViewProps {
  mode: "create" | "edit";
  context: LessonEditorContext;
  baseValues: AssignmentWizardValues;
  draft: WizardDraft | null;
  draftKey: string;
  /** Edit mode: the saved assignment. */
  existing?: AssignmentItem;
}

/** Create / Edit Assignment wizard shell: header, 7-step stepper, active step and footer actions. */
export function AssignmentWizardView({ mode, context, baseValues, draft, draftKey, existing }: AssignmentWizardViewProps) {
  const wizard = useAssignmentWizard({ mode, assignmentId: existing?.id, existing, baseValues, draft, draftKey });
  const { form, step } = wizard;
  const moduleId = useWatch({ control: form.control, name: "moduleId" });
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
          courseId={context.course.id}
          courseTitle={context.course.title}
          moduleLabel={wizardModuleLabel(context, moduleId)}
          assignmentTitle={existing?.title}
          onBack={() => wizard.requestLeave(listHref)}
        />
        <WizardStepper
          current={step}
          completed={wizard.completed}
          isClickable={wizard.isClickable}
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
