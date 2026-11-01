"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FormProvider, useFormState } from "react-hook-form";
import { Archive, LogOut, Save, Send } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { QuizCourseRef, QuizItem } from "@/types/quiz";
import { quizStepOfField, type QuizWizardStep, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizWizardHeader } from "./shell/QuizWizardHeader";
import { QuizWizardStepper } from "./shell/QuizWizardStepper";
import { QuizWizardFooter, continueAction, type QuizFooterAction } from "./shell/QuizWizardFooter";
import { QuizStepContent } from "./shell/QuizStepContent";
import { QuizWizardProvider } from "./shell/QuizWizardContext";
import { useQuizWizard } from "./shell/useQuizWizard";
import type { QuizWizardDraft } from "./shell/quizWizardDraft";

export interface QuizWizardViewProps {
  mode: "create" | "edit";
  courses: QuizCourseRef[];
  baseValues: QuizWizardValues;
  draft: QuizWizardDraft | null;
  draftKey: string;
  /** Edit mode: the saved quiz. */
  existing?: QuizItem;
}

/** Create / Edit Quiz wizard shell: header, 4-step stepper, active step and footer actions. */
export function QuizWizardView({ mode, courses, baseValues, draft, draftKey, existing }: QuizWizardViewProps) {
  const wizard = useQuizWizard({ mode, existing, baseValues, draft, draftKey });
  const { form, step, busy, publishChoice } = wizard;
  const { errors } = useFormState({ control: form.control });
  const errorSteps = Array.from(new Set(Object.keys(errors).map((k) => quizStepOfField(k)))) as QuizWizardStep[];

  const cancelHref = mode === "edit" && existing ? `/quizzes/${existing.id}` : "/quizzes";

  const reviewActions = (): { primary: QuizFooterAction; secondary?: QuizFooterAction } => {
    if (mode === "edit") {
      const icon = publishChoice === "PUBLISHED" ? <Send /> : publishChoice === "ARCHIVED" ? <Archive /> : <Save />;
      return {
        primary: { label: "Save Changes", icon, onClick: () => void wizard.submit(publishChoice), isLoading: !!busy, loadingLabel: "Saving..." },
      };
    }
    const draftAction: QuizFooterAction = {
      label: "Save as Draft",
      icon: <Save />,
      onClick: () => void wizard.submit("DRAFT"),
      isLoading: busy === "DRAFT",
      loadingLabel: "Saving...",
    };
    if (publishChoice === "DRAFT") return { primary: draftAction };
    return {
      secondary: draftAction,
      primary: { label: "Publish Quiz", icon: <Send />, onClick: () => void wizard.submit("PUBLISHED"), isLoading: busy === "PUBLISHED", loadingLabel: "Publishing..." },
    };
  };

  const actions = step === "review" ? reviewActions() : { primary: continueAction(() => void wizard.next()) };
  const footer = (
    <QuizWizardFooter
      backKind={step === "basic" ? "cancel" : "previous"}
      onBack={step === "basic" ? () => wizard.requestLeave(cancelHref) : wizard.previous}
      busy={!!busy}
      {...actions}
    />
  );

  const contextValue = useMemo(
    () => ({ mode, currentStatus: existing?.status ?? ("DRAFT" as const), publishChoice, setPublishChoice: wizard.setPublishChoice }),
    [mode, existing?.status, publishChoice, wizard.setPublishChoice]
  );

  return (
    <FormProvider {...form}>
      <QuizWizardProvider value={contextValue}>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8">
          <QuizWizardHeader mode={mode} step={step} quiz={existing} />
          <QuizWizardStepper current={step} completed={wizard.completed} isReachable={wizard.isReachable} errorSteps={errorSteps} onSelect={wizard.goToStep} />
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <QuizStepContent step={step} mode={mode} courses={courses} footer={footer} onGoToStep={wizard.goToStep} />
          </form>
        </motion.div>

        <ConfirmModal
          isOpen={wizard.leaveOpen}
          title="Discard unsaved changes?"
          subtitle={mode === "edit" ? "Your edits haven't been saved yet." : "This quiz hasn't been saved yet."}
          message={
            mode === "edit"
              ? "If you leave now, the changes you made to this quiz will be lost."
              : "If you leave now, everything you entered in this wizard will be lost."
          }
          confirmLabel="Discard & Leave"
          pendingLabel="Leaving..."
          confirmIcon={<LogOut className="h-4 w-4" />}
          onClose={wizard.closeLeave}
          onConfirm={wizard.confirmLeave}
        />
      </QuizWizardProvider>
    </FormProvider>
  );
}

export default QuizWizardView;
