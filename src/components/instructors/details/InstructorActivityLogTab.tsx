"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  UserCog,
  BookOpen,
  FileText,
  Users,
  CalendarClock,
  MessageSquareHeart,
  CircleDollarSign,
  StickyNote,
  Monitor,
  Smartphone,
  Server,
  Settings,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TablePagination } from "@/components/ui/TablePagination";
import { useUrlParams } from "@/lib/useUrlParams";
import { DetailCard } from "@/components/ui/DetailCard";
import { TabFilterBar } from "./TabFilterBar";
import {
  ACTIVITY_TYPE_META,
  ActivityLogEntry,
  ActivityLogType,
  DATE_RANGE_OPTIONS,
} from "./activity/activityLogData";

const PAGE_SIZE = 8;

const TYPE_ICON: Record<ActivityLogType, { icon: React.ReactNode; className: string }> = {
  profile_updated: { icon: <UserCog />, className: "bg-blue-14 text-blue" },
  course_published: { icon: <BookOpen />, className: "bg-green-bg text-green" },
  course_updated: { icon: <FileText />, className: "bg-purple-14 text-purple" },
  student_enrolled: { icon: <Users />, className: "bg-blue-14 text-blue" },
  live_class: { icon: <CalendarClock />, className: "bg-brand-orange-light text-brand-orange" },
  new_review: { icon: <MessageSquareHeart />, className: "bg-red-14 text-red" },
  earning: { icon: <CircleDollarSign />, className: "bg-green-bg text-green" },
  note_added: { icon: <StickyNote />, className: "bg-purple-14 text-purple" },
};

const DEVICE_ICON = { Web: <Monitor />, Mobile: <Smartphone />, System: <Server /> };

interface InstructorActivityLogTabProps {
  entries: ActivityLogEntry[];
}

export function InstructorActivityLogTab({ entries }: InstructorActivityLogTabProps) {
  const { get, getPage, set } = useUrlParams();
  const [now] = useState(() => Date.now());
  const query = get("q");
  const type = get("type", "All");
  const range = get("range", "All");
  const page = getPage();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const days = DATE_RANGE_OPTIONS.find((o) => o.value === range)?.days ?? Infinity;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return entries.filter(
      (e) =>
        (type === "All" || e.type === type) &&
        new Date(e.at).getTime() >= cutoff &&
        (!q ||
          e.details.toLowerCase().includes(q) ||
          e.actor.name.toLowerCase().includes(q) ||
          ACTIVITY_TYPE_META[e.type].label.toLowerCase().includes(q))
    );
  }, [entries, query, type, range, now]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ColumnDef<ActivityLogEntry>[] = [
    {
      key: "icon",
      header: "",
      width: "60px",
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex w-9 h-9 rounded-full items-center justify-center [&>svg]:w-4 [&>svg]:h-4 ${TYPE_ICON[row.type].className}`}
        >
          {TYPE_ICON[row.type].icon}
        </span>
      ),
    },
    {
      key: "at",
      header: "Date & Time",
      render: (row) => {
        const date = new Date(row.at);
        return (
          <div className="whitespace-nowrap">
            <p className="body-sm-regular text-primary-500">
              {date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
            </p>
            <p className="body-xsm-regular text-primary-300">
              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        );
      },
    },
    {
      key: "user",
      header: "User",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-44">
          {row.actor.role === "Automated" ? (
            <span className="w-9 h-9 rounded-full bg-gray-bg text-primary-400 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </span>
          ) : (
            <Avatar src={row.actor.avatarUrl} name={row.actor.name} size={36} />
          )}
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate">{row.actor.name}</p>
            <p className="body-xsm-regular text-primary-300">{row.actor.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <ToneBadge tone={ACTIVITY_TYPE_META[row.type].tone}>{ACTIVITY_TYPE_META[row.type].label}</ToneBadge>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row) => <p className="body-sm-regular text-primary-400 min-w-56 max-w-80">{row.details}</p>,
    },
    {
      key: "ip",
      header: "IP Address",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{row.ip}</span>,
    },
    {
      key: "device",
      header: "Device",
      render: (row) => (
        <span className="inline-flex items-center gap-2 body-sm-regular text-primary-400 [&>svg]:w-4 [&>svg]:h-4">
          {DEVICE_ICON[row.device]}
          {row.device}
        </span>
      ),
    },
  ];

  return (
    <DetailCard
      title="Activity Log"
      description="Track all important activities related to this instructor."
      action={
        <TabFilterBar
          className="md:flex-row"
          filters={[
            {
              key: "type",
              value: type,
              options: [
                { value: "All", label: "All Activities" },
                ...(Object.keys(ACTIVITY_TYPE_META) as ActivityLogType[]).map((t) => ({
                  value: t,
                  label: ACTIVITY_TYPE_META[t].label,
                })),
              ],
              onChange: (value) => set({ type: value, page: null }),
              className: "md:w-48",
            },
            {
              key: "range",
              value: range,
              options: DATE_RANGE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
                icon: <Calendar className="w-4 h-4 text-blue" />,
              })),
              onChange: (value) => set({ range: value, page: null }),
              className: "md:w-48",
            },
          ]}
          search={{
            value: query,
            placeholder: "Search activities...",
            onChange: (q) => set({ q, page: null }),
            className: "md:w-64 md:order-last",
          }}
        />
      }
      bodyClassName="space-y-5"
    >
      <div className="rounded-lg border border-dash overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={rows}
            rowKey={(row) => row.id}
            verticalBorders
            containerClassName="border-0 rounded-none"
            headerClassName="bg-slate-50 border-b border-dash"
            thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
            cellClassName="px-3.5 py-3"
            emptyMessage="No activities match your filters."
          />
        </div>
        <TablePagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={filtered.length}
          itemLabel="activities"
          onPageChange={(next) => set({ page: next })}
        />
      </div>
    </DetailCard>
  );
}

export default InstructorActivityLogTab;
