import React from "react";
import { Lightbulb } from "lucide-react";
import { WizardSideCard } from "./WizardSideCard";
import { CheckList } from "./CheckList";

/** "Tips for …" side card with a green-check list. */
export function TipsCard({ title, tips }: { title: string; tips: string[] }) {
  return (
    <WizardSideCard icon={<Lightbulb className="h-5 w-5" />} title={title}>
      <CheckList items={tips} />
    </WizardSideCard>
  );
}

export default TipsCard;
