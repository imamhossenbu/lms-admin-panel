"use client";

import React from "react";
import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  CircleDot,
  Clock,
  FileText,
  Gauge,
  Hash,
  History,
  Layers,
  Pencil,
  Repeat,
  Target,
  UserRound,
} from "lucide-react";
import type { QuizCourseRef, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { totalMarksOf } from "@/lib/quizStats";
import {
  QUIZ_DIFFICULTY_LABEL,
  QUIZ_DIFFICULTY_TONE,
  QUIZ_STATUS_LABEL,
  QUIZ_STATUS_TONE,
  attemptsLabel,
  availabilityLabel,
  formatDateTime,
  quizLocation,
  timeLimitLabel,
} from "../../quizFormat";
import { InfoRow } from "./InfoRow";

export interface QuizInformationCardProps {
  quiz: QuizItem;
  course: QuizCourseRef | undefined;
  onEdit: () => void;
}

/** Right-column summary of every quiz setting, with an "Edit" shortcut to the wizard. */
export function QuizInformationCard({ quiz, course, onEdit }: QuizInformationCardProps) {
  const total = totalMarksOf(quiz);
  const { moduleLabel, courseLabel } = quizLocation(quiz, course);
  const passPct = total > 0 ? Math.round((quiz.passingMarks / total) * 100) : 0;

  return (
    <IconSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Quiz Information"
      action={
        <CardActionButton icon={<Pencil />} onClick={onEdit}>
          Edit
        </CardActionButton>
      }
      bodyClassName="mt-3"
    >
      <dl className="divide-y divide-dash">
        <InfoRow icon={FileText} label="Title">
          {quiz.title}
        </InfoRow>
        <InfoRow icon={BookOpen} label="Course">
          {courseLabel || "—"}
        </InfoRow>
        <InfoRow icon={Layers} label="Module">
          {moduleLabel || "—"}
        </InfoRow>
        <InfoRow icon={Gauge} label="Difficulty">
          <ToneBadge tone={QUIZ_DIFFICULTY_TONE[quiz.difficulty]}>{QUIZ_DIFFICULTY_LABEL[quiz.difficulty]}</ToneBadge>
        </InfoRow>
        <InfoRow icon={Hash} label="Total Marks">
          {total}
        </InfoRow>
        <InfoRow icon={Target} label="Passing Marks">
          {quiz.passingMarks} ({passPct}%)
        </InfoRow>
        <InfoRow icon={Clock} label="Time Limit">
          {timeLimitLabel(quiz)}
        </InfoRow>
        <InfoRow icon={Repeat} label="Attempts Allowed">
          {attemptsLabel(quiz)}
        </InfoRow>
        <InfoRow icon={CalendarRange} label="Availability">
          {availabilityLabel(quiz)}
        </InfoRow>
        <InfoRow icon={CircleDot} label="Status">
          <ToneBadge tone={QUIZ_STATUS_TONE[quiz.status]}>{QUIZ_STATUS_LABEL[quiz.status]}</ToneBadge>
        </InfoRow>
        <InfoRow icon={UserRound} label="Created By">
          {quiz.createdBy}
        </InfoRow>
        <InfoRow icon={CalendarDays} label="Created At">
          {formatDateTime(quiz.createdAt)}
        </InfoRow>
        <InfoRow icon={History} label="Last Updated">
          {formatDateTime(quiz.updatedAt)}
        </InfoRow>
      </dl>
    </IconSectionCard>
  );
}

export default QuizInformationCard;
