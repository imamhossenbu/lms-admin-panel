"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { CertificateStatusBadge } from "../shared/CertificateStatusBadge";
import type { IssuedRow } from "./certificateListUtils";
import { CertificateCodeCell, ExpiresCell, GradeCell, IssuedDateCell, RecipientCell } from "./IssuedCells";
import { IssuedRowActions, type IssuedRowHandlers } from "./IssuedRowActions";

export interface IssuedTableProps {
  rows: IssuedRow[];
  handlers: IssuedRowHandlers;
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: React.ReactNode;
  /** Pagination footer, rendered inside the bordered card. */
  footer?: React.ReactNode;
}

/** Issued certificates (fixed layout + explicit widths so it fits ~1000px without horizontal scroll). */
export function IssuedTable({ rows, handlers, selectedIds, onSelectRow, onSelectAll, emptyMessage, footer }: IssuedTableProps) {
  const columns: ColumnDef<IssuedRow>[] = [
    { key: "certificate", header: "Certificate", render: (r) => <CertificateCodeCell code={r.cert.code} templateName={r.templateName} /> },
    { key: "recipient", header: "Recipient", width: "200px", render: (r) => <RecipientCell recipient={r.cert.recipient} /> },
    {
      key: "course",
      header: "Course",
      width: "150px",
      render: (r) => (
        <p className="truncate body-sm-regular text-primary-500" title={r.courseTitle}>
          {r.courseTitle}
        </p>
      ),
    },
    { key: "issued", header: "Issued", width: "104px", render: (r) => <IssuedDateCell iso={r.cert.issuedAt} method={r.cert.method} /> },
    { key: "expires", header: "Expires", width: "104px", render: (r) => <ExpiresCell iso={r.cert.expiresAt} soon={r.expiresSoon} /> },
    { key: "grade", header: "Grade", width: "64px", align: "center", render: (r) => <GradeCell grade={r.cert.grade} /> },
    { key: "status", header: "Status", width: "92px", align: "center", render: (r) => <CertificateStatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", width: "60px", align: "center", render: (r) => <IssuedRowActions row={r} handlers={handlers} /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        onRowClick={(r) => handlers.onView(r)}
        selectable
        selectedRowKeys={selectedIds}
        onSelectRow={(key, checked) => onSelectRow(String(key), checked)}
        onSelectAll={onSelectAll}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-230"
        thClassName="px-2.5 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-2.5 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default IssuedTable;
