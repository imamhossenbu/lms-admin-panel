"use client";

import React from "react";
import { ArrowDownUp, Check, Settings2, Trash2 } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { QuickActionTile } from "./QuickActionTile";

export interface ResourceQuickActionsCardProps {
  count: number;
  reordering: boolean;
  onToggleReorder: () => void;
  onRemoveAll: () => void;
}

/** Right "Quick Actions": reorder mode toggle + remove all. */
export function ResourceQuickActionsCard({ count, reordering, onToggleReorder, onRemoveAll }: ResourceQuickActionsCardProps) {
  return (
    <EditorSectionCard icon={<Settings2 className="h-5 w-5" />} title="Quick Actions" description="Common resource management actions.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <QuickActionTile
          icon={reordering ? <Check className="h-5 w-5" /> : <ArrowDownUp className="h-5 w-5" />}
          title={reordering ? "Done Reordering" : "Reorder Resources"}
          description={reordering ? "Back to the resources table." : "Drag and drop to change the order of resources."}
          active={reordering}
          disabled={!reordering && count < 2}
          onClick={onToggleReorder}
        />
        <QuickActionTile
          icon={<Trash2 className="h-5 w-5" />}
          title="Remove All Resources"
          description="Delete all resources from this lesson."
          tone="red"
          disabled={count === 0}
          onClick={onRemoveAll}
        />
      </div>
    </EditorSectionCard>
  );
}

export default ResourceQuickActionsCard;
