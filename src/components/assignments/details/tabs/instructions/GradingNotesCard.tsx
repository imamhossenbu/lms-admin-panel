import React from "react";
import { Star } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { BulletList } from "./BulletList";

/** "Grading Notes": what graders look for + "Total N Points" badge. */
export function GradingNotesCard({ notes, totalPoints }: { notes: string[]; totalPoints: number }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dash p-4">
      <Star className="mt-0.5 h-6 w-6 shrink-0 text-yellow" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h4 className="body-sm-medium font-semibold! text-primary-500">Grading Notes</h4>
            <p className="mt-0.5 body-xsm-regular text-primary-300">Your submission will be graded based on:</p>
          </div>
          <ToneBadge tone="blue" size="sm">
            Total {totalPoints} Points
          </ToneBadge>
        </div>
        <BulletList items={notes} className="mt-2.5 space-y-1 body-xsm-regular" empty="No grading notes added yet." />
      </div>
    </div>
  );
}

export default GradingNotesCard;
