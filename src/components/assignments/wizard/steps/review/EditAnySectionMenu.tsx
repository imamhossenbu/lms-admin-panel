"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import type { WizardStep } from "@/validations/assignmentWizardSchema";
import type { ReviewSection } from "./reviewSummary";

/** "Edit Any Section" dropdown listing the six editable steps. */
export function EditAnySectionMenu({ sections, onGoToStep }: { sections: ReviewSection[]; onGoToStep: (step: WizardStep) => void }) {
  return (
    <AppDropdownMenu
      align="end"
      items={sections.map((s, i) => ({ key: s.step, label: `${i + 1}. ${s.title}`, onClick: () => onGoToStep(s.step) }))}
      trigger={
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-dash bg-white px-4 body-sm-medium text-blue transition-colors hover:bg-blue-14 active:scale-95"
        >
          <Pencil className="h-4 w-4" />
          Edit Any Section
        </button>
      }
    />
  );
}

export default EditAnySectionMenu;
