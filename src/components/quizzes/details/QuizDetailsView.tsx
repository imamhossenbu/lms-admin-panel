"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Archive, Trash2 } from "lucide-react";
import type { QuizActivity, QuizAttempt, QuizItem } from "@/types/quiz";
import { useQuizCourses } from "@/lib/quizStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { QuizDetailsHeader } from "./QuizDetailsHeader";
import { QuizDetailTabs } from "./QuizDetailTabs";
import { QuizDetailPanels } from "./QuizDetailPanels";
import { QuizDetailsSkeleton } from "./QuizDetailsSkeleton";
import { QuizNotFound } from "./QuizNotFound";
import { QuizStudentPreviewModal } from "./QuizStudentPreviewModal";
import { QuizDetailsActionsProvider } from "./QuizDetailsContext";
import { useQuizDetails } from "./hooks/useQuizDetails";
import { useQuizDetailTab } from "./hooks/useQuizDetailTab";
import { useQuizActions, type QuizActions } from "./hooks/useQuizActions";

export interface QuizDetailsViewProps {
  quizId: string;
}

interface LoadedProps {
  quiz: QuizItem;
  attempts: QuizAttempt[];
  activity: QuizActivity[];
  onQuizChange: (next: QuizItem) => void;
}

function QuizDetailsLoaded({ quiz, attempts, activity, onQuizChange }: LoadedProps) {
  const { activeTab, setActiveTab } = useQuizDetailTab();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const actions = useQuizActions(quiz, onQuizChange);
  const value: QuizActions = { ...actions, openPreview: () => setIsPreviewOpen(true) };
  const courses = useQuizCourses();
  const course = courses?.find((c) => c.id === quiz.courseId);

  return (
    <QuizDetailsActionsProvider value={value}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
        <QuizDetailsHeader quiz={quiz} course={course} />
        <QuizDetailTabs activeTab={activeTab} onChange={setActiveTab} counts={{ questions: quiz.questions.length, submissions: attempts.length }} />
        <QuizDetailPanels
          activeTab={activeTab}
          quiz={quiz}
          attempts={attempts}
          activity={activity}
          course={course}
          onQuizChange={onQuizChange}
          onTabChange={setActiveTab}
        />
      </motion.div>

      <QuizStudentPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} quiz={quiz} />
      <ConfirmModal
        isOpen={actions.confirm === "archive"}
        title="Archive this quiz?"
        subtitle="You can publish it again later."
        message={
          <>
            <strong>{quiz.title}</strong> will be hidden from students. Its {attempts.length} submission{attempts.length === 1 ? "" : "s"} and analytics are kept.
          </>
        }
        confirmLabel="Archive Quiz"
        pendingLabel="Archiving..."
        confirmIcon={<Archive className="h-4 w-4" />}
        onClose={actions.closeConfirm}
        onConfirm={actions.confirmArchive}
      />
      <ConfirmModal
        isOpen={actions.confirm === "delete"}
        title="Delete this quiz?"
        message={
          <>
            <strong>{quiz.title}</strong>, its {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}, {attempts.length} submission
            {attempts.length === 1 ? "" : "s"} and activity history will be permanently removed.
          </>
        }
        confirmLabel="Delete Quiz"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={actions.closeConfirm}
        onConfirm={actions.confirmDelete}
      />
    </QuizDetailsActionsProvider>
  );
}

/** Quiz Details page: breadcrumb header, URL-synced PillTabs and the active tab body; live-refreshes from storage. */
export function QuizDetailsView({ quizId }: QuizDetailsViewProps) {
  const { state, setQuiz } = useQuizDetails(quizId);
  if (state.status === "loading") return <QuizDetailsSkeleton />;
  if (state.status === "notFound") return <QuizNotFound />;
  return <QuizDetailsLoaded quiz={state.quiz} attempts={state.attempts} activity={state.activity} onQuizChange={setQuiz} />;
}

export default QuizDetailsView;
