"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Users } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorOption } from "@/types/lessonEditor";
import { GROUP_MODE_OPTIONS } from "./accessOptions";
import { fieldErrorMessage } from "./fieldError";
import { GroupChecklist } from "./GroupChecklist";
import { RadioOptionList } from "./RadioOptionList";

/** "Access by User Groups": mode radios + group checklist (disabled for "All enrolled students"). */
export function UserGroupsCard({ groups }: { groups: LessonEditorOption[] }) {
  const { control, formState } = useFormContext<LessonEditorValues>();
  const groupMode = useWatch({ control, name: "access.groupMode" });
  const groupsError = fieldErrorMessage(formState.errors.access?.groupIds);

  return (
    <IconSectionCard icon={<Users className="h-5 w-5" />} title="Access by User Groups" description="Allow or restrict access for specific student groups.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Controller
          control={control}
          name="access.groupMode"
          render={({ field }) => (
            <RadioOptionList name="access-group-mode" aria-label="Group access" value={field.value} onChange={field.onChange} options={GROUP_MODE_OPTIONS} />
          )}
        />
        <Controller
          control={control}
          name="access.groupIds"
          render={({ field }) => (
            <GroupChecklist groups={groups} value={field.value} onChange={field.onChange} disabled={groupMode === "ALL"} error={groupMode === "ALL" ? undefined : groupsError} />
          )}
        />
      </div>
    </IconSectionCard>
  );
}

export default UserGroupsCard;
