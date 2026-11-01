"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuizInfoCard } from "../../shell/QuizInfoCard";
import { QuizStudentPreviewModal } from "./QuizStudentPreviewModal";

/** "Quiz Preview" side card + the student preview modal. */
export function QuizPreviewCard({ values }: { values: QuizWizardValues }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <QuizInfoCard icon={<Eye className="h-5 w-5" />} title="Quiz Preview">
        <p>See how this quiz will look to students before publishing.</p>
        <SecondaryButton fullWidth className="mt-3" leftIcon={<Eye />} onClick={() => setOpen(true)}>
          Preview Quiz
        </SecondaryButton>
      </QuizInfoCard>
      <QuizStudentPreviewModal isOpen={open} onClose={() => setOpen(false)} values={values} />
    </>
  );
}

export default QuizPreviewCard;
