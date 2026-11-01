"use client";

import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AlarmClock } from "lucide-react";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { ToggleBox } from "../submission/kit/ToggleBox";
import { Collapse } from "../submission/kit/Collapse";
import { LatePenaltyInline } from "./LatePenaltyInline";

type Choice = "ALLOW" | "DISALLOW";

/** Late Submission toggle + Allow / Do Not Allow radios (same fields as step 3). */
export function LateSubmissionBox() {
  const { control, setValue, trigger, formState } = useFormContext<AssignmentWizardValues>();
  const policy = useWatch({ control, name: "lateSubmission" });
  const allowed = policy !== "DISALLOW";
  // Remember the last "allowed" mode so toggling off → on keeps the penalty choice.
  const lastAllowed = useRef<AssignmentWizardValues["lateSubmission"]>(allowed ? policy : "ALLOW");
  useEffect(() => {
    if (policy !== "DISALLOW") lastAllowed.current = policy;
  }, [policy]);

  const set = (on: boolean) => {
    setValue("lateSubmission", on ? lastAllowed.current : "DISALLOW", { shouldDirty: true });
    if (formState.errors.latePenalty) void trigger("latePenalty");
  };

  return (
    <ToggleBox
      icon={<AlarmClock className="h-5 w-5" />}
      title="Late Submission"
      description="Control whether students can submit after the due date."
      checked={allowed}
      onChange={set}
      alwaysShowChildren
    >
      <div className="space-y-3">
        <ChoiceCardGroup<Choice>
          name="late-submission-schedule"
          aria-label="Late Submission"
          value={allowed ? "ALLOW" : "DISALLOW"}
          onChange={(v) => set(v === "ALLOW")}
          columns={2}
          tone="blue"
          options={[
            { value: "ALLOW", title: "Allow Late Submission", description: "Students can still submit after the due date (marked as late)." },
            { value: "DISALLOW", title: "Do Not Allow Late Submission", description: "Students cannot submit after the due date." },
          ]}
        />
        <Collapse open={allowed}>
          <div className="rounded-xl border border-dash bg-gray-bg p-4">
            <LatePenaltyInline />
          </div>
        </Collapse>
      </div>
    </ToggleBox>
  );
}

export default LateSubmissionBox;
