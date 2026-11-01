"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Play, Video } from "lucide-react";
import type { LiveClassItem, LiveDisplayStatus } from "@/types/liveClass";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { courseOf } from "@/lib/liveClassStats";
import { LiveStatusBadge } from "../shared/LiveStatusBadge";
import { canJoin, liveSubtitle } from "./liveDetailFormat";
import { LiveClassMoreMenu } from "./LiveClassMoreMenu";
import type { LiveClassActions } from "./hooks/useLiveClassActions";

export interface LiveClassDetailsHeaderProps {
  liveClass: LiveClassItem;
  status: LiveDisplayStatus;
  actions: LiveClassActions;
}

/** Breadcrumb, title + status badge, subtitle and the page actions (Edit / Start-Join / More). */
export function LiveClassDetailsHeader({ liveClass, status, actions }: LiveClassDetailsHeaderProps) {
  const router = useRouter();
  const course = courseOf(liveClass.courseId);
  const isLive = status === "LIVE";

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Live Classes", href: "/live-classes" }, { label: liveClass.title }]} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold text-primary-500">{liveClass.title}</h1>
            <LiveStatusBadge status={status} />
          </div>
          <p className="mt-1.5 body-regular text-primary-300">{liveSubtitle(liveClass.type, course?.title ?? "this")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <PrimaryButton leftIcon={<Pencil />} onClick={() => router.push(`/live-classes/${liveClass.id}/edit`)}>
            Edit Class
          </PrimaryButton>
          <SecondaryButton
            leftIcon={isLive ? <Video /> : <Play />}
            onClick={actions.join}
            disabled={!canJoin(status)}
            title={canJoin(status) ? "Opens the meeting in a new tab" : "This class can no longer be joined"}
          >
            {isLive ? "Join Class" : "Start Class"}
          </SecondaryButton>
          <LiveClassMoreMenu status={status} actions={actions} />
        </div>
      </div>
    </div>
  );
}

export default LiveClassDetailsHeader;
