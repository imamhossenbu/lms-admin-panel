import React from "react";
import { ProTipCard } from "@/components/ui/ProTipCard";

const NOTES = [
  "Drip schedule is based on each student's individual enrollment date.",
  "If you change the schedule, it will apply to new enrollments only.",
  "Existing students will not be affected.",
  "Make sure prerequisite lessons are published and available.",
];

/** Orange "Important Notes" box. */
export function ImportantNotesCard() {
  return (
    <ProTipCard title="Important Notes">
      <ul className="list-disc space-y-1 pl-4 marker:text-brand-orange">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </ProTipCard>
  );
}

export default ImportantNotesCard;
