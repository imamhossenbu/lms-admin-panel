"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ChannelBadges } from "@/components/notifications/shared/ChannelBadges";
import { BroadcastStatusBadge } from "./BroadcastStatusBadge";
import { BroadcastOpensCell, BroadcastRecipientsCell, BroadcastTitleCell, BroadcastWhenCell } from "./BroadcastCells";
import { BroadcastRowActions, type BroadcastRowHandlers } from "./BroadcastRowActions";
import type { BroadcastRow } from "./broadcastFormat";

export const BROADCAST_TABLE_PROPS = {
  verticalBorders: true,
  containerClassName: "border-0 rounded-none",
  headerClassName: "bg-slate-50 border-b border-dash",
  tableClassName: "table-fixed",
  thClassName: "px-3 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap",
  cellClassName: "px-3 py-2.5",
} as const;

export interface BroadcastsTableProps {
  rows: BroadcastRow[];
  handlers: BroadcastRowHandlers;
  emptyMessage: React.ReactNode;
  /** Pagination footer, rendered inside the bordered card. */
  footer?: React.ReactNode;
}

/** Broadcast list (fixed layout + explicit widths so it fits ~1000px without horizontal scroll). */
export function BroadcastsTable({ rows, handlers, emptyMessage, footer }: BroadcastsTableProps) {
  const columns: ColumnDef<BroadcastRow>[] = [
    { key: "broadcast", header: "Broadcast", render: (r) => <BroadcastTitleCell row={r} /> },
    { key: "channels", header: "Channels", width: "190px", render: (r) => <ChannelBadges channels={r.broadcast.channels} /> },
    { key: "status", header: "Status", width: "120px", align: "center", render: (r) => <BroadcastStatusBadge status={r.broadcast.status} size="sm" /> },
    { key: "when", header: "Sent / Scheduled for", width: "156px", render: (r) => <BroadcastWhenCell row={r} /> },
    { key: "recipients", header: "Recipients", width: "100px", render: (r) => <BroadcastRecipientsCell row={r} /> },
    { key: "opens", header: "Opens", width: "104px", render: (r) => <BroadcastOpensCell row={r} /> },
    { key: "actions", header: "Actions", width: "68px", align: "center", render: (r) => <BroadcastRowActions broadcast={r.broadcast} handlers={handlers} /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable columns={columns} data={rows} rowKey={(r) => r.id} onRowClick={(r) => handlers.onView(r.broadcast)} minWidth="min-w-240" emptyMessage={emptyMessage} {...BROADCAST_TABLE_PROPS} />
      {footer}
    </div>
  );
}

export default BroadcastsTable;
