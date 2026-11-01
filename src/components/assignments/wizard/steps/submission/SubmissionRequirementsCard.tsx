"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FileCheck2 } from "lucide-react";
import { WizardSideCard } from "../../shell/WizardSideCard";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { CheckList } from "../../shell/CheckList";
import { penaltySentence } from "./kit/penalty";

/** Requirements derived live from the step's values. */
export function SubmissionRequirementsCard() {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [type, types, maxFiles, size, late, penalty, unit, attemptsMode, maxAttempts] = useWatch({
    control,
    name: ["type", "allowedFileTypes", "maxFiles", "maxFileSizeMb", "lateSubmission", "latePenalty", "latePenaltyUnit", "attemptsMode", "maxAttempts"],
  });

  const items: string[] = [];
  if (type === "FILE_UPLOAD") {
    items.push(types?.length ? `Upload files of type ${types.join(", ")}` : "Choose at least one allowed file type");
    items.push(`Up to ${maxFiles} file${maxFiles === 1 ? "" : "s"} per submission`);
    if (Number.isFinite(size)) items.push(`Maximum file size: ${size} MB per file`);
  } else if (type === "TEXT") {
    items.push("Write and submit the answer as text directly");
  } else {
    items.push("Submit a working URL (GitHub, Google Drive, etc.)");
  }
  items.push(
    attemptsMode === "UNLIMITED"
      ? "Unlimited attempts — students can resubmit"
      : attemptsMode === "SINGLE"
        ? "Single attempt — only one submission allowed"
        : `Up to ${Number.isFinite(maxAttempts) ? maxAttempts : "—"} attempts`
  );
  items.push(
    late === "DISALLOW"
      ? "Late submissions are not accepted"
      : late === "ALLOW"
        ? "Late submissions are accepted (marked as late)"
        : `Late submissions accepted — ${penaltySentence(penalty, unit).replace(/^Deduct/, "deduct").replace(/\.$/, "")}`
  );

  return (
    <WizardSideCard icon={<FileCheck2 className="h-5 w-5" />} title="Submission Requirements">
      <CheckList items={items} />
    </WizardSideCard>
  );
}

export default SubmissionRequirementsCard;
