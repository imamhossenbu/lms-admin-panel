"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { questionPerformance, totalMarksOf } from "@/lib/quizStats";
import type { QuizTabProps } from "../../quizTabTypes";
import { QuestionsListCard } from "./QuestionsListCard";
import { QuestionSummaryCard } from "./QuestionSummaryCard";
import { HardestQuestionsCard } from "./HardestQuestionsCard";
import { hardestQuestions, questionSummary } from "./questionsTabStats";

/** Quiz details → Questions tab: expandable question list (main) + summary, hardest questions, tip (right). */
export function QuestionsTab({ quiz, attempts }: QuizTabProps) {
  const router = useRouter();
  const performance = useMemo(() => questionPerformance(quiz, attempts), [quiz, attempts]);
  const summary = useMemo(() => questionSummary(quiz.questions), [quiz.questions]);
  const hardest = useMemo(() => hardestQuestions(performance), [performance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3"
    >
      <div className="min-w-0 xl:col-span-2">
        <QuestionsListCard
          questions={quiz.questions}
          performance={performance}
          totalMarks={totalMarksOf(quiz)}
          onEdit={() => router.push(`/quizzes/${quiz.id}/edit?step=questions`)}
        />
      </div>
      <aside className="min-w-0 space-y-5">
        <QuestionSummaryCard summary={summary} />
        <HardestQuestionsCard items={hardest} />
        <ProTipCard title="Improve Hard Questions">
          Questions below 60% correct often have unclear wording or a missing explanation. Review them and add an explanation so
          students learn from their mistakes.
        </ProTipCard>
      </aside>
    </motion.div>
  );
}

export default QuestionsTab;
