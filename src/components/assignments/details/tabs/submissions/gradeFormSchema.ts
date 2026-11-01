import { z } from "zod";
import type { AssignmentItem } from "@/types/assignment";
import { gradeSubmissionSchema } from "@/validations/assignmentSchema";

/** Shared grade schema + per-criterion picks (every criterion required when the rubric is enabled). */
export function gradeFormSchema(assignment: AssignmentItem) {
  const useRubric = assignment.rubric.enabled && assignment.rubric.criteria.length > 0;
  return gradeSubmissionSchema(assignment.totalPoints)
    .extend({ criterionScores: z.record(z.string(), z.number()) })
    .superRefine((v, ctx) => {
      if (!useRubric) return;
      const missing = assignment.rubric.criteria.filter((c) => typeof v.criterionScores[c.id] !== "number");
      if (missing.length)
        ctx.addIssue({ code: "custom", path: ["criterionScores"], message: `Pick a level for ${missing.map((c) => c.title).join(", ")}` });
    });
}
export type GradeFormValues = z.infer<ReturnType<typeof gradeFormSchema>>;
