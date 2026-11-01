"use client";

import React from "react";
import { Ban, Link2, RotateCcw, Video, Zap } from "lucide-react";
import type { LiveDisplayStatus } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { canJoin } from "../../liveDetailFormat";
import type { LiveClassActions } from "../../hooks/useLiveClassActions";

/** Join (orange), Copy Meeting Link, Cancel / Restore — each disabled by status. */
export function MeetingActionsCard({ status, actions }: { status: LiveDisplayStatus; actions: LiveClassActions }) {
  const isCancelled = status === "CANCELLED";
  return (
    <IconSectionCard icon={<Zap className="h-5 w-5" />} tone="green" title="Meeting Actions" bodyClassName="space-y-3">
      <PrimaryButton fullWidth leftIcon={<Video />} onClick={actions.join} disabled={!canJoin(status)}>
        Join Class
      </PrimaryButton>
      <SecondaryButton fullWidth leftIcon={<Link2 />} onClick={() => void actions.copyLink()} disabled={isCancelled || !actions.hasLink}>
        Copy Meeting Link
      </SecondaryButton>
      {isCancelled ? (
        <SecondaryButton fullWidth leftIcon={<RotateCcw />} onClick={() => actions.openConfirm("restore")}>
          Restore Class
        </SecondaryButton>
      ) : (
        <PrimaryButton fullWidth variant="danger" leftIcon={<Ban />} onClick={() => actions.openConfirm("cancel")} disabled={status === "COMPLETED"}>
          Cancel Class
        </PrimaryButton>
      )}
      {!canJoin(status) && (
        <p className="body-xsm-regular text-primary-300">
          {isCancelled ? "This class was cancelled — restore it to reopen the meeting." : "This class has ended, so the meeting can no longer be joined."}
        </p>
      )}
    </IconSectionCard>
  );
}

export default MeetingActionsCard;
