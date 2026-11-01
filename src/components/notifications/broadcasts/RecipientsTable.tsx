"use client";

import React from "react";
import type { BroadcastDelivery } from "@/types/notification";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ChannelBadges } from "@/components/notifications/shared/ChannelBadges";
import { BROADCAST_TABLE_PROPS } from "./BroadcastsTable";
import { DELIVERY_STATUS_META, formatShortDateTime } from "./broadcastFormat";

function RecipientCell({ d }: { d: BroadcastDelivery }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={d.recipient.name} size={30} />
      <div className="min-w-0">
        <p className="truncate body-sm-medium text-primary-500" title={d.recipient.name}>
          {d.recipient.name}
        </p>
        <p className="truncate body-xsm-regular text-primary-300" title={d.recipient.email}>
          {d.recipient.email}
        </p>
      </div>
    </div>
  );
}

function TimeCell({ iso }: { iso: string | null }) {
  if (!iso) return <span className="body-sm-regular text-primary-300">—</span>;
  return (
    <span className="whitespace-nowrap body-sm-regular text-primary-500" title={new Date(iso).toLocaleString("en-US")}>
      {formatShortDateTime(iso)}
    </span>
  );
}

export interface RecipientsTableProps {
  rows: BroadcastDelivery[];
  emptyMessage: React.ReactNode;
  footer?: React.ReactNode;
}

/** One row per recipient × channel: status, delivered / opened / clicked times and the failure reason. */
export function RecipientsTable({ rows, emptyMessage, footer }: RecipientsTableProps) {
  const columns: ColumnDef<BroadcastDelivery>[] = [
    { key: "recipient", header: "Recipient", render: (d) => <RecipientCell d={d} /> },
    { key: "channel", header: "Channel", width: "108px", render: (d) => <ChannelBadges channels={[d.channel]} /> },
    {
      key: "status",
      header: "Status",
      width: "108px",
      align: "center",
      render: (d) => (
        <ToneBadge tone={DELIVERY_STATUS_META[d.status].tone} size="sm" dot>
          {DELIVERY_STATUS_META[d.status].label}
        </ToneBadge>
      ),
    },
    { key: "delivered", header: "Delivered", width: "136px", render: (d) => <TimeCell iso={d.deliveredAt} /> },
    { key: "opened", header: "Opened", width: "136px", render: (d) => <TimeCell iso={d.openedAt} /> },
    { key: "clicked", header: "Clicked", width: "136px", render: (d) => <TimeCell iso={d.clickedAt} /> },
    {
      key: "error",
      header: "Error",
      width: "180px",
      render: (d) =>
        d.error ? (
          <p className="truncate body-xsm-regular text-red" title={d.error}>
            {d.error}
          </p>
        ) : (
          <span className="body-sm-regular text-primary-300">—</span>
        ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable columns={columns} data={rows} rowKey={(d) => d.id} minWidth="min-w-240" emptyMessage={emptyMessage} {...BROADCAST_TABLE_PROPS} />
      {footer}
    </div>
  );
}

export default RecipientsTable;
