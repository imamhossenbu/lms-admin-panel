"use client";

import React from "react";
import { Archive, Copy, Eye, Pencil, RotateCcw, Zap } from "lucide-react";
import type { QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { useQuizDetailsActions } from "../../QuizDetailsContext";
import { QuickActionTile } from "./QuickActionTile";

/** Preview / Edit / Duplicate / Archive (or Restore when archived) shortcuts. */
export function QuizQuickActionsCard({ quiz }: { quiz: QuizItem }) {
  const act = useQuizDetailsActions();
  const busy = act.busy !== null;
  return (
    <IconSectionCard icon={<Zap className="h-5 w-5" />} title="Quick Actions" bodyClassName="@container mt-4">
      <div className="grid grid-cols-1 gap-2.5 @xs:grid-cols-2">
        <QuickActionTile icon={Eye} label="Preview Quiz" onClick={act.openPreview} />
        <QuickActionTile icon={Pencil} label="Edit Quiz" onClick={act.editQuiz} />
        <QuickActionTile icon={Copy} label="Duplicate Quiz" onClick={() => void act.duplicate()} disabled={busy} />
        {quiz.status === "ARCHIVED" ? (
          <QuickActionTile icon={RotateCcw} label="Publish Again" onClick={() => void act.togglePublish()} disabled={busy} />
        ) : (
          <QuickActionTile icon={Archive} label="Archive Quiz" onClick={act.requestArchive} disabled={busy} danger />
        )}
      </div>
    </IconSectionCard>
  );
}

export default QuizQuickActionsCard;
