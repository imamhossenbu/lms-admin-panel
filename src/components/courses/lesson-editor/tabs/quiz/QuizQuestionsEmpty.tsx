import React from "react";
import { ListChecks } from "lucide-react";

/** Placeholder inside "Questions" when the list is empty. */
export function QuizQuestionsEmpty({ invalid }: { invalid?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center ${invalid ? "border-red bg-red-14" : "border-dash bg-gray-bg"}`}>
      <ListChecks className={`h-7 w-7 ${invalid ? "text-red" : "text-primary-300"}`} />
      <p className="body-sm-medium text-primary-500">No questions yet</p>
      <p className="body-xsm-regular text-primary-300">Use &quot;Add Question&quot; to write questions or generate them with AI.</p>
    </div>
  );
}

export default QuizQuestionsEmpty;
