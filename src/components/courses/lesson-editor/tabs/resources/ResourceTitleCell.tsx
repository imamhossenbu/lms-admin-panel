import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { ResourceIcon } from "./ResourceIcon";

export interface ResourceTitleCellProps {
  resource: LessonEditorResource;
  isEditing?: boolean;
  error?: string;
}

/** Table "Title" cell: type tile + title + description (+ "Editing" / error state). */
export function ResourceTitleCell({ resource, isEditing, error }: ResourceTitleCellProps) {
  return (
    <div className="flex min-w-56 items-center gap-3">
      <ResourceIcon resource={resource} size="sm" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate body-sm-medium text-primary-500" title={resource.title}>
            {resource.title}
          </p>
          {isEditing && (
            <ToneBadge tone="orange" size="sm">
              Editing
            </ToneBadge>
          )}
        </div>
        {error ? (
          <p className="body-xsm-regular text-red">{error}</p>
        ) : (
          resource.description && (
            <p className="truncate body-xsm-regular text-primary-300" title={resource.description}>
              {resource.description}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default ResourceTitleCell;
