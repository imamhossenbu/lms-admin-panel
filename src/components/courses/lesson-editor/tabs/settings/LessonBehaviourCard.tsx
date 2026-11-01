"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SlidersHorizontal } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorSectionCard } from "../../shared/EditorSectionCard";
import { SettingToggleRow } from "../../shared/SettingToggleRow";
import { CompletionRuleField } from "./CompletionRuleField";

type BehaviourKey = "freePreview" | "allowComments" | "allowQuestions" | "showInCurriculum" | "downloadableContent";

const BEHAVIOUR_TOGGLES: { key: BehaviourKey; title: string; description: string }[] = [
  { key: "freePreview", title: "Free Preview", description: "Let non-enrolled visitors watch this lesson." },
  { key: "allowComments", title: "Allow Comments", description: "Students can discuss the lesson in the comments section." },
  { key: "allowQuestions", title: "Allow Questions (Q&A)", description: "Students can ask the instructor questions about this lesson." },
  { key: "showInCurriculum", title: "Show in Curriculum", description: "List this lesson in the public course curriculum." },
  { key: "downloadableContent", title: "Downloadable Content", description: "Allow students to download the lesson text and attachments." },
];

/** "Lesson Behaviour": access/interaction toggles and the completion rule. */
export function LessonBehaviourCard() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <EditorSectionCard
      icon={<SlidersHorizontal className="h-5 w-5" />}
      title="Lesson Behaviour"
      description="Control how students interact with this lesson."
      tone="blue"
      bodyClassName="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {BEHAVIOUR_TOGGLES.map(({ key, title, description }) => (
          <Controller
            key={key}
            control={control}
            name={`settings.${key}`}
            render={({ field }) => <SettingToggleRow title={title} description={description} checked={field.value} onChange={field.onChange} />}
          />
        ))}
      </div>
      <div className="border-t border-dash pt-5">
        <CompletionRuleField />
      </div>
    </EditorSectionCard>
  );
}

export default LessonBehaviourCard;
