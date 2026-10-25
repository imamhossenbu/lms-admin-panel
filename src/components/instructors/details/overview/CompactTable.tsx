"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";

interface CompactTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage: string;
  onRowClick?: (row: T) => void;
}

/** Dense DataTable variant for the overview cards (column borders kept per design system). */
export function CompactTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage,
  onRowClick,
}: CompactTableProps<T>) {
  return (
    <div className="rounded-lg border border-dash overflow-x-auto">
      <DataTable
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
        onRowClick={onRowClick}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        thClassName="px-3 py-2 body-xsm-medium text-primary-400 font-semibold normal-case"
        cellClassName="px-3 py-2"
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

export default CompactTable;
