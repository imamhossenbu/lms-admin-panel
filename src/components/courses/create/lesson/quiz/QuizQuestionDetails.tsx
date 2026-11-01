import React from "react";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { optionLetter } from "./quizUtils";

/** Expanded body of a question card: lettered options (correct one highlighted) + explanation. */
export function QuizQuestionDetails({ question }: { question: LessonQuizQuestion }) {
  return (
    <div className="space-y-3 border-t border-dash px-4 py-3">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const correct = option === question.correctAnswer;
          return (
            <li
              key={`${i}-${option}`}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2",
                correct ? "border-green/30 bg-green-bg" : "border-dash bg-white"
              )}
            >
              {correct ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green" aria-label="Correct answer" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-primary-300" aria-hidden />
              )}
              <span className={cn("body-xsm-medium shrink-0", correct ? "text-green" : "text-primary-300")}>{optionLetter(i)}.</span>
              <span className={cn("min-w-0 break-words body-sm-regular", correct ? "text-green" : "text-primary-400")}>
                {option || "Empty option"}
              </span>
            </li>
          );
        })}
      </ul>
      {question.explanation && (
        <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
          <p className="body-xsm-regular text-primary-400">
            <span className="body-xsm-medium text-primary-500">Explanation: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizQuestionDetails;
