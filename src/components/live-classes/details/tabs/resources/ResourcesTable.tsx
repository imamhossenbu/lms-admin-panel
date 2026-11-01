"use client";

import React from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { TablePagination } from "@/components/ui/TablePagination";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LiveResource } from "@/types/liveClass";
import { formatBytes, isoClock, shortDate } from "../qa/liveTabFormat";
import { RESOURCE_TYPE_META, VISIBILITY_META } from "./resourceMeta";
import { ResourceTypeTile } from "./ResourceTypeTile";
import { RESOURCE_PAGE_SIZE } from "./useResourceFilters";

export interface ResourcesTableProps {
  rows: LiveResource[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onOpen: (r: LiveResource) => void;
  onEdit: (r: LiveResource) => void;
  onDelete: (r: LiveResource) => void;
  emptyMessage: React.ReactNode;
}

/** Class resources table (checkbox, #, resource, type, size, added at, visibility, ⋮). */
export function ResourcesTable(p: ResourcesTableProps) {
  const offset = (p.page - 1) * RESOURCE_PAGE_SIZE;
  const columns: ColumnDef<LiveResource>[] = [
    { key: "n", header: "#", width: "48px", render: (_, i) => <span className="body-sm-regular text-primary-300">{offset + i + 1}</span> },
    {
      key: "resource",
      header: "Resource",
      render: (r) => (
        <span className="flex items-center gap-3">
          <ResourceTypeTile type={r.type} />
          <span className="min-w-0">
            <span className="block max-w-xs truncate body-sm-medium font-semibold! text-primary-500" title={r.title}>
              {r.title}
            </span>
            {r.description && (
              <span className="block max-w-xs truncate body-xsm-regular text-primary-300" title={r.description}>
                {r.description}
              </span>
            )}
          </span>
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "112px",
      render: (r) => <ToneBadge tone={RESOURCE_TYPE_META[r.type].tone}>{RESOURCE_TYPE_META[r.type].label}</ToneBadge>,
    },
    { key: "size", header: "File Size", width: "96px", render: (r) => <span className="whitespace-nowrap body-sm-regular text-primary-400">{formatBytes(r.size)}</span> },
    {
      key: "addedAt",
      header: "Added At",
      width: "120px",
      render: (r) => (
        <span className="block whitespace-nowrap body-sm-regular text-primary-400">
          {shortDate(r.addedAt)}
          <span className="block body-xsm-regular text-primary-300">{isoClock(r.addedAt)}</span>
        </span>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      width: "136px",
      render: (r) => <ToneBadge tone={VISIBILITY_META[r.visibility].tone}>{VISIBILITY_META[r.visibility].label}</ToneBadge>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "84px",
      align: "center",
      render: (r) => (
        <RowMoreMenu
          size="sm"
          label="Resource actions"
          items={[
            { key: "open", label: "Open", icon: <ExternalLink className="h-4 w-4" />, onClick: () => p.onOpen(r) },
            { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: () => p.onEdit(r) },
            { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => p.onDelete(r), danger: true, separatorBefore: true },
          ]}
        />
      ),
    },
  ];

  const ids = p.rows.map((r) => r.id);
  return (
    <div className="overflow-hidden rounded-xl border border-dash">
      <DataTable
        columns={columns}
        data={p.rows}
        rowKey={(r) => r.id}
        selectable
        selectedRowKeys={p.selected.filter((id) => ids.includes(id))}
        onSelectRow={(key, checked) => p.onSelectedChange(checked ? [...p.selected, String(key)] : p.selected.filter((id) => id !== key))}
        onSelectAll={(checked) => p.onSelectedChange(checked ? Array.from(new Set([...p.selected, ...ids])) : p.selected.filter((id) => !ids.includes(id)))}
        emptyMessage={p.emptyMessage}
        className="rounded-none border-0"
        minWidth="min-w-200"
      />
      {p.total > 0 && <TablePagination currentPage={p.page} totalCount={p.total} pageSize={RESOURCE_PAGE_SIZE} itemLabel="resources" onPageChange={p.onPageChange} />}
    </div>
  );
}

export default ResourcesTable;
