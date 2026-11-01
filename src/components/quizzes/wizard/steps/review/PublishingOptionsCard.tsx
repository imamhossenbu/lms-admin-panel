"use client";

import React from "react";
import { Rocket } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { useQuizWizardContext, type QuizPublishChoice } from "../../shell/QuizWizardContext";

const CREATE_OPTIONS: ChoiceOption<QuizPublishChoice>[] = [
  { value: "PUBLISHED", title: "Publish Now", description: "Make this quiz available to students immediately." },
  { value: "DRAFT", title: "Save as Draft", description: "Save this quiz as a draft. You can publish it later." },
];

const EDIT_OPTIONS: ChoiceOption<QuizPublishChoice>[] = [
  { value: "PUBLISHED", title: "Published", description: "Students can see and take this quiz." },
  { value: "DRAFT", title: "Draft", description: "Hidden from students until you publish it." },
];

const ARCHIVED_OPTION: ChoiceOption<QuizPublishChoice> = { value: "ARCHIVED", title: "Keep Archived", description: "Stays hidden from students." };

/** Publish Now / Save as Draft (create) or the status to save with (edit). Drives the footer's main button. */
export function PublishingOptionsCard() {
  const { mode, currentStatus, publishChoice, setPublishChoice } = useQuizWizardContext();
  const options = mode === "create" ? CREATE_OPTIONS : currentStatus === "ARCHIVED" ? [...EDIT_OPTIONS, ARCHIVED_OPTION] : EDIT_OPTIONS;
  return (
    <IconSectionCard
      icon={<Rocket className="h-5 w-5" />}
      title="Publishing Options"
      description={mode === "create" ? "Choose what happens when you finish." : "Status to save this quiz with."}
      bodyClassName="mt-4"
    >
      <ChoiceCardGroup<QuizPublishChoice>
        name="quiz-publishing"
        aria-label="Publishing options"
        value={publishChoice}
        onChange={setPublishChoice}
        options={options}
        columns={2}
        className="sm:grid-cols-1!"
      />
    </IconSectionCard>
  );
}

export default PublishingOptionsCard;
