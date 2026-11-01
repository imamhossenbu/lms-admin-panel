"use client";

import React from "react";
import { Copy, Pencil } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { BroadcastStatusBadge } from "./BroadcastStatusBadge";
import { BroadcastMoreMenu } from "./BroadcastMoreMenu";
import { BROADCASTS_LIST_HREF } from "./BroadcastNotFound";
import { audienceLabel, canEditBroadcast, formatDateTime } from "./broadcastFormat";

export interface BroadcastDetailHeaderProps {
  broadcast: Broadcast;
  busy: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

function subtitleParts(b: Broadcast): string[] {
  const audience = audienceLabel(b, { short: true });
  switch (b.status) {
    case "SENT":
      return [`Sent to ${audience}`, b.sendAt ? formatDateTime(b.sendAt) : "", `by ${b.createdBy}`];
    case "SCHEDULED":
      return [`Scheduled for ${audience}`, b.sendAt ? formatDateTime(b.sendAt) : "", `by ${b.createdBy}`];
    case "DRAFT":
      return [`Draft for ${audience}`, `Last edited ${formatDateTime(b.updatedAt)}`, `by ${b.createdBy}`];
    default:
      return [`Was for ${audience}`, `Cancelled ${formatDateTime(b.updatedAt)}`, `by ${b.createdBy}`];
  }
}

/** Breadcrumb, title + status badge, "Sent to {audience} · {date} · by Admin" and the page actions. */
export function BroadcastDetailHeader({ broadcast: b, busy, onDuplicate, onEdit, onCancel, onDelete }: BroadcastDetailHeaderProps) {
  const parts = subtitleParts(b).filter(Boolean);
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Notifications", href: "/notifications" }, { label: "Broadcasts", href: BROADCASTS_LIST_HREF }, { label: b.title }]} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold text-primary-500 break-words">{b.title}</h1>
            <BroadcastStatusBadge status={b.status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 body-regular text-primary-300">
            {parts.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden>·</span>}
                <span>{p}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SecondaryButton leftIcon={<Copy />} onClick={onDuplicate} isLoading={busy} disabled={busy}>
            Duplicate
          </SecondaryButton>
          {canEditBroadcast(b) && (
            <PrimaryButton leftIcon={<Pencil />} onClick={onEdit} disabled={busy}>
              Edit
            </PrimaryButton>
          )}
          <BroadcastMoreMenu broadcast={b} disabled={busy} onCancel={onCancel} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

export default BroadcastDetailHeader;
