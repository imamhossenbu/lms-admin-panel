"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { NotificationTemplateItem } from "@/types/notification";
import { timeAgo } from "@/lib/notificationStats";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ChannelBadges } from "../shared/ChannelBadges";
import { TemplateEnabledCell } from "./TemplateEnabledCell";
import { formatDate } from "./templateUtils";

export const templateEditHref = (id: string) => `/notifications/templates/${encodeURIComponent(id)}/edit`;

/** Event · Channels · Sent (30 days) · Last updated · Enabled · Actions — fixed layout that fits ~1200px. */
export function TemplatesTable({ templates }: { templates: NotificationTemplateItem[] }) {
  const router = useRouter();

  const columns: ColumnDef<NotificationTemplateItem>[] = [
    {
      key: "event",
      header: "Event",
      render: (t) => (
        <div className="min-w-0">
          <p className="truncate body-sm-medium font-semibold! text-primary-500" title={t.name}>
            {t.name}
          </p>
          <p className="mt-0.5 truncate body-xsm-regular text-primary-300" title={t.slug}>
            {t.slug}
          </p>
        </div>
      ),
    },
    { key: "channels", header: "Channels", width: "230px", render: (t) => <ChannelBadges channels={t.channels} /> },
    {
      key: "sent",
      header: "Sent (30 days)",
      width: "130px",
      align: "center",
      render: (t) => <span className="body-sm-medium text-primary-500">{t.sentLast30.toLocaleString("en-US")}</span>,
    },
    {
      key: "updated",
      header: "Last updated",
      width: "150px",
      render: (t) => (
        <div className="min-w-0">
          <p className="truncate body-sm-regular text-primary-500">{formatDate(t.updatedAt)}</p>
          <p className="mt-0.5 truncate body-xsm-regular text-primary-300">{timeAgo(t.updatedAt)}</p>
        </div>
      ),
    },
    { key: "enabled", header: "Enabled", width: "120px", align: "center", render: (t) => <TemplateEnabledCell template={t} /> },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      align: "center",
      render: (t) => (
        <CardActionButton icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => router.push(templateEditHref(t.id))} aria-label={`Edit ${t.name}`}>
          Edit
        </CardActionButton>
      ),
    },
  ];

  return <DataTable columns={columns} data={templates} rowKey={(t) => t.id} tableClassName="table-fixed" minWidth="min-w-4xl" emptyMessage="No automated templates yet." />;
}

export default TemplatesTable;
