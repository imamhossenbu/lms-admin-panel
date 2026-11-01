"use client";

import React from "react";
import { Table2 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { AssignmentPreviewCard } from "../../preview/AssignmentPreviewCard";
import { TipsCard } from "../../shell/TipsCard";
import { RubricInfoFields } from "./RubricInfoFields";
import { RubricCriteriaSection } from "./RubricCriteriaSection";
import { RubricSummaryCard } from "./RubricSummaryCard";
import { UseTemplateMenu } from "./UseTemplateMenu";
import { CriterionModal } from "./CriterionModal";
import { CopyRubricModal } from "./CopyRubricModal";
import { useRubricCriteria } from "./useRubricCriteria";

const TIPS = [
  "Keep the criteria clear and specific.",
  "Use measurable and observable criteria.",
  "Set fair point distribution for each criterion.",
  "Provide clear descriptions to avoid confusion.",
  "You can use templates or copy rubrics from existing assignments.",
];

/** Wizard step 5 — Rubric. */
export function RubricStep({ context, footer }: WizardStepProps) {
  const r = useRubricCriteria();

  return (
    <>
      <WizardLayout
        main={
          <IconSectionCard
            icon={<Table2 className="h-5 w-5" />}
            title="Rubric"
            description="Create a grading rubric to evaluate student submissions."
            action={<UseTemplateMenu onPickTemplate={r.pickTemplate} onCopyFromAssignment={() => r.setCopyOpen(true)} />}
            bodyClassName="mt-5 space-y-6"
          >
            <RubricInfoFields />
            <RubricCriteriaSection
              fields={r.fields}
              canAdd={r.fields.length < 12}
              onAdd={r.openAdd}
              onEdit={r.openEdit}
              onDelete={r.removeAt}
              onPointsChange={r.revalidate}
            />
            {footer}
          </IconSectionCard>
        }
        side={
          <>
            <AssignmentPreviewCard context={context} badge="live" />
            <RubricSummaryCard fields={r.fields} onMove={r.move} />
            <TipsCard title="Tips for Creating a Good Rubric" tips={TIPS} />
          </>
        }
      />

      <CriterionModal
        isOpen={r.modalOpen}
        criterion={r.editing}
        number={(r.editIndex ?? 0) + 1}
        suggestedPoints={r.suggestedPoints}
        onClose={r.closeModal}
        onSave={r.save}
      />
      <CopyRubricModal isOpen={r.copyOpen} courseId={context.course.id} onClose={() => r.setCopyOpen(false)} onPick={r.pickAssignment} />
      <ConfirmModal
        isOpen={!!r.pending}
        title="Replace current rubric?"
        subtitle="Your current criteria will be replaced."
        message={
          <>
            Applying <strong>{r.pending?.label}</strong> replaces the {r.fields.length} existing criteria and the rubric title/description.
          </>
        }
        confirmLabel="Replace Rubric"
        onClose={r.clearPending}
        onConfirm={r.confirmPending}
      />
    </>
  );
}

export default RubricStep;
