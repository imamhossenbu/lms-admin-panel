"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Download, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { ModalShell } from "@/components/ui/ModalShell";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatDuration } from "@/lib/quizStats";
import { cn } from "@/lib/cn";
import { StudentCell } from "./common/StudentCell";
import { AttemptResultBadge } from "./common/AttemptResultBadge";
import { formatDateTime, formatNumber, ordinal, plainText } from "./quizFormat";
import { downloadAttemptDetailCsv } from "./quizCsv";

export interface AttemptDetailsModalProps {
  quiz: QuizItem;
  /** null = closed. */
  attempt: QuizAttempt | null;
  onClose: () => void;
}

/** Exports one attempt's per-question CSV with toast feedback. */
export function exportAttemptCsv(quiz: QuizItem, attempt: QuizAttempt) {
  try {
    const file = downloadAttemptDetailCsv(quiz, attempt);
    toast.success("Download started", { description: `${attempt.student.name}'s attempt saved to ${file}.` });
  } catch {
    toast.error("Download failed", { description: "Your browser blocked the file. Please try again." });
  }
}

function SummaryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-dash p-3">
      <p className="body-xsm-regular text-primary-300">{label}</p>
      <div className="mt-1 body-sm-medium font-semibold! text-primary-500 whitespace-nowrap">{children}</div>
    </div>
  );
}

/** One attempt in detail: score summary + per-question correct / incorrect list with time spent. */
export function AttemptDetailsModal({ quiz, attempt, onClose }: AttemptDetailsModalProps) {
  const correct = attempt?.answers.filter((a) => a.correct).length ?? 0;
  return (
    <ModalShell
      isOpen={attempt !== null}
      onClose={onClose}
      title="Attempt Details"
      subtitle={attempt ? `${ordinal(attempt.attemptNumber)} attempt · submitted ${formatDateTime(attempt.submittedAt)}` : undefined}
      maxWidth="lg"
      footer={
        attempt && (
          <div className="flex flex-wrap justify-end gap-2.5">
            <SecondaryButton leftIcon={<Download />} onClick={() => exportAttemptCsv(quiz, attempt)}>
              Export CSV
            </SecondaryButton>
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          </div>
        )
      }
    >
      {attempt && (
        <div className="@container space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StudentCell student={attempt.student} />
            <AttemptResultBadge attempt={attempt} />
          </div>
          <div className="grid grid-cols-2 gap-2.5 @lg:grid-cols-4">
            <SummaryItem label="Score">
              {formatNumber(attempt.score)}/{attempt.totalMarks}
            </SummaryItem>
            <SummaryItem label="Percentage">{Math.round((attempt.score / (attempt.totalMarks || 1)) * 100)}%</SummaryItem>
            <SummaryItem label="Correct">
              {correct}/{quiz.questions.length}
            </SummaryItem>
            <SummaryItem label="Time Taken">{formatDuration(attempt.timeTakenSeconds)}</SummaryItem>
          </div>

          <ol className="divide-y divide-dash overflow-hidden rounded-xl border border-dash">
            {quiz.questions.map((q, i) => {
              const ans = attempt.answers.find((a) => a.questionId === q.id);
              const state = !ans ? "skipped" : ans.correct ? "correct" : "incorrect";
              return (
                <motion.li
                  key={q.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i, 12) * 0.03 }}
                  className="flex items-start gap-3 px-4 py-3"
                >
                  <span className={cn("mt-0.5 shrink-0", state === "correct" ? "text-green" : state === "incorrect" ? "text-red" : "text-primary-300")}>
                    {state === "correct" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="body-sm-medium text-primary-500">
                      {i + 1}. {plainText(q.questionHtml)}
                    </p>
                    <p className="mt-0.5 body-xsm-regular text-primary-300">
                      {q.points} mark{q.points === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <ToneBadge tone={state === "correct" ? "green" : state === "incorrect" ? "red" : "gray"} size="sm">
                      {state === "correct" ? "Correct" : state === "incorrect" ? "Incorrect" : "Not answered"}
                    </ToneBadge>
                    {ans && (
                      <span className="inline-flex items-center gap-1 body-xsm-regular text-primary-300 whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(ans.timeSeconds)}
                      </span>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      )}
    </ModalShell>
  );
}

export default AttemptDetailsModal;
