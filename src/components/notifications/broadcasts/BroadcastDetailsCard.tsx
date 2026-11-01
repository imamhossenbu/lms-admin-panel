"use client";

import React from "react";
import { BookOpen, CalendarClock, CalendarPlus, Flag, Info, Radio, UserRound, Users, type LucideIcon } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ChannelBadges } from "@/components/notifications/shared/ChannelBadges";
import { AUDIENCE_LABEL, courseTitles, formatDateTime } from "./broadcastFormat";

function Row({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 items-start gap-3 py-2.5">
      <dt className="col-span-2 flex items-center gap-2.5 body-sm-regular text-primary-300">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="col-span-3 flex min-w-0 flex-wrap items-center justify-end gap-1.5 text-right body-sm-medium text-primary-500">{children}</dd>
    </div>
  );
}

function sendRow(b: Broadcast): { label: string; value: string } {
  if (b.status === "SENT") return { label: "Sent at", value: b.sendAt ? formatDateTime(b.sendAt) : "—" };
  if (b.status === "SCHEDULED") return { label: "Scheduled for", value: b.sendAt ? formatDateTime(b.sendAt) : "—" };
  if (b.status === "CANCELLED") return { label: "Cancelled at", value: formatDateTime(b.updatedAt) };
  return { label: "Last edited", value: formatDateTime(b.updatedAt) };
}

/** Audience, courses, channels, priority, created by / at, sent / scheduled time. */
export function BroadcastDetailsCard({ broadcast: b }: { broadcast: Broadcast }) {
  const send = sendRow(b);
  const courses = courseTitles(b);
  return (
    <IconSectionCard icon={<Info className="h-5 w-5" />} tone="blue" title="Details">
      <dl className="divide-y divide-dash">
        <Row icon={Users} label="Audience">
          {AUDIENCE_LABEL[b.audience]}
        </Row>
        {b.audience === "COURSE" && (
          <Row icon={BookOpen} label="Courses">
            {courses.length ? (
              courses.map((t) => (
                <ToneBadge key={t} tone="gray" size="sm">
                  {t}
                </ToneBadge>
              ))
            ) : (
              <span className="text-primary-300">None</span>
            )}
          </Row>
        )}
        <Row icon={Radio} label="Channels">
          <ChannelBadges channels={b.channels} className="justify-end" />
        </Row>
        <Row icon={Flag} label="Priority">
          <ToneBadge tone={b.priority === "HIGH" ? "red" : "gray"} size="sm">
            {b.priority === "HIGH" ? "High" : "Normal"}
          </ToneBadge>
        </Row>
        <Row icon={UserRound} label="Created by">
          {b.createdBy}
        </Row>
        <Row icon={CalendarPlus} label="Created">
          {formatDateTime(b.createdAt)}
        </Row>
        <Row icon={CalendarClock} label={send.label}>
          {send.value}
        </Row>
      </dl>
    </IconSectionCard>
  );
}

export default BroadcastDetailsCard;
