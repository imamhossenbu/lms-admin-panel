import React from "react";
import { Lightbulb } from "lucide-react";
import { WizardSideCard } from "../../shell/WizardSideCard";
import { CheckList } from "../../shell/CheckList";

const CREATE_ITEMS = [
  "The assignment will be created and published",
  "Students will be able to view and submit their work",
  "You can edit the assignment anytime",
  "Submissions will be available in the Submissions tab",
];

const EDIT_ITEMS = [
  "Your changes will be saved to this assignment",
  "Students will see the updated details right away",
  "Existing submissions and grades are kept",
  "You can edit the assignment again anytime",
];

/** "What happens next?" checklist (copy depends on create / edit). */
export function WhatHappensNextCard({ mode }: { mode: "create" | "edit" }) {
  return (
    <WizardSideCard icon={<Lightbulb className="h-5 w-5" />} title="What happens next?" className="bg-blue-14">
      <CheckList items={mode === "edit" ? EDIT_ITEMS : CREATE_ITEMS} />
    </WizardSideCard>
  );
}

export default WhatHappensNextCard;
