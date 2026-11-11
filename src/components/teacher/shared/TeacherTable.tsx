"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { PAGE_SIZES } from "./useListParams";

/** Bordered data table (column dividers) + pagination, dimmed while the next page loads. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DataTable requires Record<string, any> rows
export function TeacherTable<T extends Record<string, any>>({ columns, rows, rowKey, total, page, perPage, itemLabel, onPage, onPerPage, empty, loading, onRowClick, minWidth = "min-w-200" }: {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (r: T) => string;
  total: number;
  page: number;
  perPage: number;
  itemLabel: string;
  onPage: (p: number) => void;
  onPerPage: (s: number) => void;
  empty: React.ReactNode;
  loading?: boolean;
  onRowClick?: (r: T) => void;
  minWidth?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-dash transition-opacity ${loading ? "opacity-60" : ""}`}>
      <DataTable columns={columns} data={rows} rowKey={rowKey} onRowClick={onRowClick} verticalBorders containerClassName="border-0 rounded-none" headerClassName="bg-slate-50 border-b border-dash" tableClassName="table-fixed" minWidth={minWidth} thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap" cellClassName="px-3.5 py-3" emptyMessage={empty} />
      {total > 0 && <TablePagination currentPage={Math.min(page, Math.max(1, Math.ceil(total / perPage)))} pageSize={perPage} totalCount={total} itemLabel={itemLabel} onPageChange={onPage} onPageSizeChange={onPerPage} pageSizeOptions={PAGE_SIZES} />}
    </div>
  );
}

export default TeacherTable;
