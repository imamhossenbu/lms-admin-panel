"use client";

import React from "react";
import { PencilLine } from "lucide-react";
import type { QuizQuestionKind } from "@/types/quiz";
import { AddQuestionMenu } from "./AddQuestionMenu";

export interface NoQuestionSelectedCardProps {
  canAdd: boolean;
  onAdd: (kind: QuizQuestionKind) => void;
}

/** Middle card placeholder while the quiz has no questions. */
export function NoQuestionSelectedCard({ canAdd, onAdd }: NoQuestionSelectedCardProps) {
  return (
    <section className="dashboard-card shadow-2xs p-5">
      <h2 className="heading-h6 font-semibold! text-primary-500">Edit Question</h2>
      <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-dash px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange">
          <PencilLine className="h-7 w-7" />
        </span>
        <p className="mt-4 body-medium font-semibold! text-primary-500">Start building your quiz</p>
        <p className="mt-1 max-w-sm body-sm-regular text-primary-300">
          Pick a question type — multiple choice, multiple select, true or false, or short answer. You can reorder questions anytime.
        </p>
        <div className="mt-5">
          <AddQuestionMenu disabled={!canAdd} onAdd={onAdd} />
        </div>
      </div>
    </section>
  );
}

export default NoQuestionSelectedCard;
