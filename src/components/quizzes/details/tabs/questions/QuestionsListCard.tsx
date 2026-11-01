"use client";

import React, { useState } from "react";
import { ChevronsDownUp, ChevronsUpDown, ListChecks, Pencil } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";
import type { QuizQuestionItem } from "@/types/quiz";
import { pluralize } from "@/components/quizzes/wizard/steps/questions/questionKinds";
import { QuestionAccordionItem } from "./QuestionAccordionItem";

export interface QuestionPerfRow {
  questionId: string;
  correctPct: number;
  answered: number;
  avgTimeSeconds: number;
}

export interface QuestionsListCardProps {
  questions: QuizQuestionItem[];
  performance: QuestionPerfRow[];
  totalMarks: number;
  onEdit: () => void;
}

/** "Questions (N)" card: Edit Questions action + expandable question list (or an empty state). */
export function QuestionsListCard({ questions, performance, totalMarks, onEdit }: QuestionsListCardProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const allOpen = questions.length > 0 && expanded.size === questions.length;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="dashboard-card shadow-2xs p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="heading-h6 font-semibold! text-primary-500">Questions ({questions.length})</h2>
          <p className="mt-0.5 body-xsm-regular text-primary-300 tabular-nums">
            {pluralize(questions.length, "question")} · {pluralize(totalMarks, "mark")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <CardActionButton
              icon={allOpen ? <ChevronsDownUp /> : <ChevronsUpDown />}
              onClick={() => setExpanded(allOpen ? new Set() : new Set(questions.map((q) => q.id)))}
            >
              {allOpen ? "Collapse All" : "Expand All"}
            </CardActionButton>
          )}
          <CardActionButton icon={<Pencil />} onClick={onEdit}>
            Edit Questions
          </CardActionButton>
        </div>
      </header>

      {questions.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-dash px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange">
            <ListChecks className="h-7 w-7" />
          </span>
          <p className="mt-4 body-medium font-semibold! text-primary-500">No questions yet</p>
          <p className="mt-1 max-w-sm body-sm-regular text-primary-300">
            This quiz doesn’t have any questions. Add questions before publishing so students can take it.
          </p>
          <CardActionButton icon={<Pencil />} onClick={onEdit} className="mt-5">
            Add Questions
          </CardActionButton>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {questions.map((q, i) => {
            const perf = performance.find((p) => p.questionId === q.id);
            return (
              <QuestionAccordionItem
                key={q.id}
                question={q}
                number={i + 1}
                correctPct={perf?.correctPct ?? 0}
                answered={perf?.answered ?? 0}
                avgTimeSeconds={perf?.avgTimeSeconds ?? 0}
                expanded={expanded.has(q.id)}
                onToggle={() => toggle(q.id)}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default QuestionsListCard;
