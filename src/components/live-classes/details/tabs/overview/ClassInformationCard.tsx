"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Info, Pencil } from "lucide-react";
import type { LiveClassItem } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { courseOf, instructorOf } from "@/lib/liveClassStats";
import { PlatformBadge } from "../../../shared/PlatformBadge";
import { formatLiveDate, LIVE_TYPE_LABEL, timeRangeLabel } from "../../liveDetailFormat";
import { InfoRow } from "./InfoRow";

/** Two-column class facts: title / course / instructor / type | date, platform, link, meeting id, passcode. */
export function ClassInformationCard({ liveClass }: { liveClass: LiveClassItem }) {
  const router = useRouter();
  const course = courseOf(liveClass.courseId);
  const instructor = instructorOf(liveClass.instructorId);

  const copyable = (value: string, label: string) =>
    value ? (
      <>
        <span className="min-w-0 truncate">{value}</span>
        <CopyButton value={value} label={label} />
      </>
    ) : (
      <span className="text-primary-300">-</span>
    );

  return (
    <IconSectionCard
      icon={<Info className="h-5 w-5" />}
      title="Class Information"
      action={
        <CardActionButton icon={<Pencil />} onClick={() => router.push(`/live-classes/${liveClass.id}/edit`)}>
          Edit
        </CardActionButton>
      }
      bodyClassName="@container"
    >
      <div className="grid grid-cols-1 gap-x-6 @2xl:grid-cols-2 @2xl:divide-x @2xl:divide-dash">
        <dl className="@2xl:pr-6">
          <InfoRow label="Class Title">{liveClass.title}</InfoRow>
          <InfoRow label="Course">
            <span className="text-blue">{course?.title ?? "-"}</span>
          </InfoRow>
          <InfoRow label="Instructor">
            <span className="text-blue">{instructor?.name ?? "-"}</span>
          </InfoRow>
          <InfoRow label="Class Type">Live Class ({LIVE_TYPE_LABEL[liveClass.type]})</InfoRow>
        </dl>
        <dl className="@2xl:pl-6">
          <InfoRow label="Date & Time">
            <span className="flex flex-col">
              <span>{formatLiveDate(liveClass.date)}</span>
              <span className="body-xsm-regular text-primary-300">{timeRangeLabel(liveClass)}</span>
            </span>
          </InfoRow>
          <InfoRow label="Platform">
            <PlatformBadge platform={liveClass.platform} />
          </InfoRow>
          <InfoRow label="Meeting Link">
            {liveClass.meetingLink ? (
              <>
                <a href={liveClass.meetingLink} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-blue hover:underline">
                  {liveClass.meetingLink}
                </a>
                <CopyButton value={liveClass.meetingLink} label="Meeting link copied" />
              </>
            ) : (
              <span className="text-primary-300">-</span>
            )}
          </InfoRow>
          <InfoRow label="Meeting ID">{copyable(liveClass.meetingId, "Meeting ID copied")}</InfoRow>
          <InfoRow label="Passcode">{copyable(liveClass.passcode, "Passcode copied")}</InfoRow>
        </dl>
      </div>
    </IconSectionCard>
  );
}

export default ClassInformationCard;
