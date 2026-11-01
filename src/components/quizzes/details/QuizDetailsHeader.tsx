"use client";

import React from "react";
import { Copy, Pencil } from "lucide-react";
import type { QuizCourseRef, QuizItem } from "@/types/quiz";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { QUIZ_STATUS_LABEL, QUIZ_STATUS_TONE, quizLocation } from "./quizFormat";
import { QuizMoreMenu } from "./QuizMoreMenu";
import { useQuizDetailsActions } from "./QuizDetailsContext";

export interface QuizDetailsHeaderProps {
  quiz: QuizItem;
  course: QuizCourseRef | undefined;
}

/** Breadcrumb, title + status badge, "Module | Course" subtitle and the page actions. */
export function QuizDetailsHeader({ quiz, course }: QuizDetailsHeaderProps) {
  const act = useQuizDetailsActions();
  const { moduleLabel, courseLabel } = quizLocation(quiz, course);

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Quizzes", href: "/quizzes" }, { label: quiz.title }]} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold text-primary-500 break-words">{quiz.title}</h1>
            <ToneBadge tone={QUIZ_STATUS_TONE[quiz.status]} size="lg">
              {QUIZ_STATUS_LABEL[quiz.status]}
            </ToneBadge>
          </div>
          {(moduleLabel || courseLabel) && (
            <p className="mt-1.5 flex flex-wrap items-center gap-2 body-regular text-primary-300">
              {moduleLabel && <span>{moduleLabel}</span>}
              {moduleLabel && courseLabel && <span aria-hidden>|</span>}
              {courseLabel && <span>{courseLabel}</span>}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <PrimaryButton leftIcon={<Pencil />} onClick={act.editQuiz}>
            Edit Quiz
          </PrimaryButton>
          <SecondaryButton leftIcon={<Copy />} onClick={() => void act.duplicate()} isLoading={act.busy === "duplicate"} disabled={act.busy !== null}>
            Duplicate
          </SecondaryButton>
          <QuizMoreMenu
            status={quiz.status}
            disabled={act.busy !== null}
            onPreview={act.openPreview}
            onTogglePublish={() => void act.togglePublish()}
            onArchive={act.requestArchive}
            onDelete={act.requestDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default QuizDetailsHeader;
