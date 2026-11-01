"use client";

import React, { useState } from "react";
import { Filter, History, SearchX } from "lucide-react";
import type { SettingsAuditEntry } from "@/lib/settingsStorage";
import { SETTINGS_SECTIONS, type SettingsSection } from "@/validations/platformSettingsSchema";
import { useUrlParams } from "@/lib/useUrlParams";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AppSelect } from "@/components/ui/AppSelect";
import { Avatar } from "@/components/ui/Avatar";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { settingsFullDate, settingsTimeAgo } from "@/components/settings/shared/settingsTime";
import { SECTION_META } from "./maintenanceUtils";

const PAGE = 8;
const ALL = "all";
const FILTER_OPTIONS = [{ value: ALL, label: "All sections" }, ...SETTINGS_SECTIONS.map((s) => ({ value: s, label: SECTION_META[s].label }))];

const parseFilter = (v: string): SettingsSection | typeof ALL => ((SETTINGS_SECTIONS as readonly string[]).includes(v) ? (v as SettingsSection) : ALL);

export interface ActivityLogCardProps {
  audit: SettingsAuditEntry[];
}

/** "Activity log": every saved settings change; section filter lives in `?log=` so it survives reloads. */
export function ActivityLogCard({ audit }: ActivityLogCardProps) {
  const { get, set } = useUrlParams();
  const filter = parseFilter(get("log"));
  const [expanded, setExpanded] = useState(false);

  const rows = filter === ALL ? audit : audit.filter((a) => a.section === filter);
  const visible = expanded ? rows : rows.slice(0, PAGE);

  const columns: ColumnDef<SettingsAuditEntry>[] = [
    {
      key: "at",
      header: "When",
      width: "24%",
      render: (a) => (
        <div className="min-w-0" title={settingsFullDate(a.at)}>
          <p className="body-sm-medium text-primary-500">{settingsTimeAgo(a.at)}</p>
          <p className="truncate body-xsm-regular text-primary-300">{settingsFullDate(a.at)}</p>
        </div>
      ),
    },
    {
      key: "section",
      header: "Section",
      width: "18%",
      render: (a) => (
        <ToneBadge tone={SECTION_META[a.section]?.tone ?? "gray"} size="sm">
          {SECTION_META[a.section]?.label ?? a.section}
        </ToneBadge>
      ),
    },
    { key: "summary", header: "Changes", width: "36%", render: (a) => <p className="line-clamp-2 body-sm-regular text-primary-400">{a.summary}</p> },
    {
      key: "actor",
      header: "By",
      width: "22%",
      render: (a) => (
        <div className="flex min-w-0 items-center gap-2">
          <Avatar name={a.actor} size="sm" />
          <span className="truncate body-sm-medium text-primary-500">{a.actor}</span>
        </div>
      ),
    },
  ];

  const empty = (
    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-bg text-primary-300">
        <SearchX className="h-5 w-5" />
      </span>
      <p className="body-sm-medium font-semibold! text-primary-500">No changes {filter === ALL ? "yet" : `in ${SECTION_META[filter].label}`}</p>
      <p className="body-xsm-regular text-primary-300">{filter === ALL ? "Saved settings changes will appear here." : "Try another section or show all sections."}</p>
      {filter !== ALL && (
        <CardActionButton className="mt-1" onClick={() => set({ log: null })}>
          Show all sections
        </CardActionButton>
      )}
    </div>
  );

  return (
    <SettingsCard
      icon={<History className="h-5 w-5" />}
      tone="purple"
      title="Activity log"
      description="Who changed which settings, and when."
      divided={false}
      action={
        <AppSelect
          size="sm"
          icon={<Filter className="h-3.5 w-3.5" />}
          value={filter}
          onValueChange={(v) => {
            setExpanded(false);
            set({ log: v === ALL ? null : v });
          }}
          options={FILTER_OPTIONS}
        />
      }
    >
      <DataTable<SettingsAuditEntry> columns={columns} data={visible} rowKey={(a) => a.id} tableClassName="table-fixed" minWidth="min-w-160" emptyMessage={empty} />
      {rows.length > PAGE && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="body-xsm-regular text-primary-300">
            Showing {visible.length} of {rows.length}
          </p>
          <CardActionButton onClick={() => setExpanded((e) => !e)}>{expanded ? "Show less" : "Show all"}</CardActionButton>
        </div>
      )}
    </SettingsCard>
  );
}

export default ActivityLogCard;
