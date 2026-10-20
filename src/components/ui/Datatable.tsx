import React from "react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DatatableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Datatable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found",
  className,
}: DatatableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="body-sm-regular text-muted">Loading records...</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-dash", className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-dash">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "py-3.5 px-4 body-xsm-medium text-brand-navy uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dash bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center body-sm-regular text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-brand-ice-soft/40 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={cn(
                      "py-3.5 px-4 body-sm-regular text-brand-navy align-middle",
                      col.className
                    )}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
