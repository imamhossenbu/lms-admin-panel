"use client";

import React from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { EditorIconButton } from "../quiz/EditorIconButton";
import { ResourceTitleCell } from "./ResourceTitleCell";
import { VisibilityBadgeButton } from "./VisibilityBadgeButton";
import { resourceSizeLabel, resourceTone, resourceTypeLabel } from "./resourceDisplay";

export interface ResourcesTableProps {
  items: LessonEditorResource[];
  editingId: string | null;
  /** Row-level validation messages keyed by index. */
  rowErrors: (string | undefined)[];
  onStartReorder: () => void;
  onToggleVisible: (index: number) => void;
  onEdit: (resource: LessonEditorResource) => void;
  onDelete: (resource: LessonEditorResource) => void;
}

/** "Added Resources" table (shared DataTable with vertical column borders). */
export function ResourcesTable({ items, editingId, rowErrors, onStartReorder, onToggleVisible, onEdit, onDelete }: ResourcesTableProps) {
  const columns: ColumnDef<LessonEditorResource>[] = [
    {
      key: "handle",
      header: <span className="sr-only">Reorder</span>,
      width: "48px",
      align: "center",
      render: () => (
        <button
          type="button"
          onClick={onStartReorder}
          aria-label="Reorder resources"
          title="Reorder resources"
          className="flex h-8 w-6 cursor-grab items-center justify-center rounded-md text-primary-300 hover:bg-gray-bg"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      ),
    },
    {
      key: "number",
      header: "#",
      width: "48px",
      align: "center",
      render: (_row, index) => <span className="body-sm-regular text-primary-400 tabular-nums">{index + 1}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (row, index) => <ResourceTitleCell resource={row} isEditing={row.id === editingId} error={rowErrors[index]} />,
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <ToneBadge tone={resourceTone(row.format)} size="sm">
          {resourceTypeLabel(row)}
        </ToneBadge>
      ),
    },
    {
      key: "size",
      header: "Size",
      render: (row) => <span className="whitespace-nowrap body-sm-regular text-primary-500">{resourceSizeLabel(row)}</span>,
    },
    {
      key: "visibility",
      header: "Visibility",
      render: (row, index) => <VisibilityBadgeButton visible={row.visible} title={row.title} onToggle={() => onToggleVisible(index)} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <EditorIconButton label={`Edit ${row.title}`} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(row)} />
          <EditorIconButton label={`Delete ${row.title}`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(row)} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      minWidth="min-w-180"
      emptyMessage="No resources yet. Use the form above to add files or links."
    />
  );
}

export default ResourcesTable;
