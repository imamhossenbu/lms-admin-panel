"use client";

import React, { useState } from "react";
import { CalendarClock, Send } from "lucide-react";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { useRecipientEstimate } from "@/lib/notificationStorage";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ChannelBadges } from "@/components/notifications/shared/ChannelBadges";
import { AUDIENCE_LABEL, courseTitleOf, formatSchedule } from "./composeUtils";

export interface ConfirmSendModalProps {
  /** Validated values awaiting confirmation (null = closed). */
  values: BroadcastFormValues | null;
  onClose: () => void;
  /** Resolve to close; throw to keep it open. */
  onConfirm: (values: BroadcastFormValues) => Promise<void>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 body-sm-regular text-primary-300">{label}</dt>
      <dd className="min-w-0 text-right body-sm-medium text-primary-500">{children}</dd>
    </div>
  );
}

/** Final check before sending / scheduling: audience, recipients, channels, timing. */
export function ConfirmSendModal({ values, onClose, onConfirm }: ConfirmSendModalProps) {
  const [pending, setPending] = useState(false);
  const estimate = useRecipientEstimate(values?.audience ?? "ALL_STUDENTS", values?.courseIds ?? []);
  if (!values) return null;

  const count = estimate ?? 0;
  const scheduled = values.timing === "SCHEDULE";
  const who = values.audience === "INSTRUCTORS" ? "instructors" : values.audience === "INACTIVE_STUDENTS" ? "inactive students" : "students";
  const title = scheduled ? `Schedule for ≈ ${count.toLocaleString()} ${who}?` : `Send to ≈ ${count.toLocaleString()} ${who}?`;

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm(values);
      onClose();
    } catch {
      // The caller shows the error toast; keep the modal open.
    } finally {
      setPending(false);
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={() => !pending && onClose()}
      title={title}
      subtitle={scheduled ? "It will go out automatically at the time below." : "Once sent, a broadcast can't be edited or recalled."}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <SecondaryButton type="button" onClick={onClose} disabled={pending}>
            Go Back
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={confirm}
            isLoading={pending}
            disabled={pending}
            leftIcon={scheduled ? <CalendarClock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          >
            {pending ? (scheduled ? "Scheduling..." : "Sending...") : scheduled ? "Schedule Broadcast" : "Send Now"}
          </PrimaryButton>
        </div>
      }
    >
      <p className="body-sm-medium font-semibold! text-primary-500 break-words">{values.title.trim()}</p>
      <dl className="mt-3 divide-y divide-dash rounded-xl border border-dash">
        <Row label="Audience">
          {AUDIENCE_LABEL[values.audience]}
          {values.audience === "COURSE" && (
            <span className="mt-1 flex flex-wrap justify-end gap-1.5">
              {values.courseIds.map((id) => (
                <ToneBadge key={id} tone="gray" size="sm">
                  {courseTitleOf(id)}
                </ToneBadge>
              ))}
            </span>
          )}
        </Row>
        <Row label="Recipients">≈ {count.toLocaleString()}</Row>
        <Row label="Channels">
          <ChannelBadges channels={values.channels} className="justify-end" />
        </Row>
        <Row label="Priority">
          {values.priority === "HIGH" ? (
            <ToneBadge tone="red" size="sm">
              High
            </ToneBadge>
          ) : (
            "Normal"
          )}
        </Row>
        <Row label="Delivery">{scheduled ? formatSchedule(values.scheduledAt) : "Immediately"}</Row>
      </dl>
    </ModalShell>
  );
}

export default ConfirmSendModal;
