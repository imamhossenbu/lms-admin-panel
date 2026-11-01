"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Copy, Settings, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonOption } from "../access/lessonOptions";
import { CopyScheduleModal } from "./CopyScheduleModal";
import { DRIP_DEFAULTS, type DripValues } from "./dripOptions";
import { QuickActionTile } from "./QuickActionTile";

export interface QuickActionsCardProps {
  courseId: string;
  lessonId: string;
  lessonOptions: LessonOption[];
}

/** "Quick Actions": clear the drip section or copy it from another lesson. */
export function QuickActionsCard({ courseId, lessonId, lessonOptions }: QuickActionsCardProps) {
  const { setValue, formState } = useFormContext<LessonEditorValues>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  const applyDrip = (drip: DripValues) =>
    setValue("drip", structuredClone(drip), { shouldDirty: true, shouldTouch: true, shouldValidate: formState.isSubmitted });

  const handleClear = async () => {
    applyDrip(DRIP_DEFAULTS);
    toast.success("Schedule cleared", { description: "Drip settings were reset. Click Update Lesson to save." });
  };

  const handleCopy = (drip: DripValues, source: LessonOption) => {
    applyDrip({ ...drip, dependencies: { ...drip.dependencies, lessonIds: drip.dependencies.lessonIds.filter((id) => id !== lessonId) } });
    toast.success("Schedule copied", { description: `Drip settings copied from "${source.title}". Click Update Lesson to save.` });
  };

  return (
    <EditorSectionCard icon={<Settings className="h-5 w-5" />} title="Quick Actions" description="Common drip schedule actions.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <QuickActionTile tone="red" icon={<Trash2 className="h-4 w-4" />} title="Clear Schedule" description="Remove all drip settings for this lesson." onClick={() => setConfirmOpen(true)} />
        <QuickActionTile tone="blue" icon={<Copy className="h-4 w-4" />} title="Copy Schedule" description="Copy drip schedule from another lesson." onClick={() => setCopyOpen(true)} />
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear drip schedule?"
        subtitle="Unsaved until you click Update Lesson."
        message="Release type, timing, dependencies and the locked message will be reset to their defaults."
        confirmLabel="Clear Schedule"
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onConfirm={handleClear}
      />
      <CopyScheduleModal isOpen={copyOpen} onClose={() => setCopyOpen(false)} courseId={courseId} lessonOptions={lessonOptions} onCopy={handleCopy} />
    </EditorSectionCard>
  );
}

export default QuickActionsCard;
