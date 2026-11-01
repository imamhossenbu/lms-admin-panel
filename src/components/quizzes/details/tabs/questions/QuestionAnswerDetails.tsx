import React from "react";
import { CheckCircle2, Circle, Clock, Shuffle } from "lucide-react";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { QuizQuestionItem } from "@/types/quiz";
import { formatDuration } from "@/lib/quizStats";
import { optionLetter, questionPlainText } from "@/components/quizzes/wizard/steps/questions/questionKinds";

export interface QuestionAnswerDetailsProps {
  question: QuizQuestionItem;
  answered: number;
  avgTimeSeconds: number;
}

/** Expanded body of a question: full text, options (correct highlighted green) or accepted answers, explanation. */
export function QuestionAnswerDetails({ question: q, answered, avgTimeSeconds }: QuestionAnswerDetailsProps) {
  const hasExplanation = questionPlainText(q.explanationHtml).length > 0;

  return (
    <div className="space-y-4 border-t border-dash px-4 py-4">
      <RichTextContent html={q.questionHtml} className="text-primary-500" />

      {q.kind === "SHORT_ANSWER" ? (
        <div>
          <p className="mb-2 body-xsm-medium text-primary-400">Accepted Answers</p>
          <div className="flex flex-wrap gap-2">
            {q.acceptedAnswers.length ? (
              q.acceptedAnswers.map((a) => (
                <ToneBadge key={a} tone="green" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                  {a}
                </ToneBadge>
              ))
            ) : (
              <span className="body-xsm-regular text-primary-300">No accepted answers set.</span>
            )}
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {q.options.map((o, i) => {
            const correct = q.correctOptionIds.includes(o.id);
            return (
              <li
                key={o.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3.5 py-2.5",
                  correct ? "border-green/40 bg-green-bg" : "border-dash bg-white"
                )}
              >
                {correct ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green" /> : <Circle className="h-4 w-4 shrink-0 text-primary-300" />}
                <span className={cn("body-sm-medium", correct ? "text-green" : "text-primary-400")}>{optionLetter(i)}.</span>
                <span className={cn("min-w-0 flex-1 body-sm-regular", correct ? "text-primary-500" : "text-primary-400")}>{o.text}</span>
                {correct && (
                  <ToneBadge tone="green" size="sm" variant="pill">
                    Correct
                  </ToneBadge>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {hasExplanation && (
        <div className="rounded-lg border border-blue/20 bg-blue-14 px-3.5 py-3">
          <p className="body-xsm-medium text-blue">Explanation</p>
          <RichTextContent html={q.explanationHtml} className="mt-1" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <ToneBadge tone={q.required ? "red" : "gray"} size="sm" variant="pill">
          {q.required ? "Required" : "Optional"}
        </ToneBadge>
        {q.timeLimitSeconds ? (
          <ToneBadge tone="blue" size="sm" variant="pill" icon={<Clock className="h-3 w-3" />}>
            {q.timeLimitSeconds}s limit
          </ToneBadge>
        ) : null}
        {q.shuffleOptions && (
          <ToneBadge tone="purple" size="sm" variant="pill" icon={<Shuffle className="h-3 w-3" />}>
            Shuffled options
          </ToneBadge>
        )}
        {answered > 0 && (
          <ToneBadge tone="gray" size="sm" variant="pill">
            {answered} answers · avg {formatDuration(avgTimeSeconds)}
          </ToneBadge>
        )}
      </div>
    </div>
  );
}

export default QuestionAnswerDetails;
