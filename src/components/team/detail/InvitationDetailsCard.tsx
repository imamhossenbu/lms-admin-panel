"use client";

import React from "react";
import { MailOpen, Send, XCircle } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { inviteState } from "@/lib/teamStats";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { expiresIn, fullDate } from "../shared/teamFormat";

export interface InvitationDetailsCardProps {
  member: TeamMember;
  busy: boolean;
  onResend: () => void;
  onRevoke: () => void;
}

/** For invitations (instead of Security): sent / expiry / resent count / personal message + Resend / Revoke. */
export function InvitationDetailsCard({ member: m, busy, onResend, onRevoke }: InvitationDetailsCardProps) {
  if (!m.invite) return null;
  const expired = inviteState(m) === "EXPIRED";
  const rows: [string, React.ReactNode][] = [
    ["Sent", fullDate(m.invite.sentAt)],
    ["Invited by", m.invite.invitedBy],
    [
      "Expires",
      <ToneBadge key="exp" tone={expired ? "red" : "yellow"} size="sm" dot>
        {expired ? `Expired · ${fullDate(m.invite.expiresAt)}` : `${expiresIn(m.invite.expiresAt)} · ${fullDate(m.invite.expiresAt)}`}
      </ToneBadge>,
    ],
    ["Times resent", m.invite.resentCount],
  ];
  return (
    <IconSectionCard icon={<MailOpen className="h-5 w-5" />} tone="yellow" title="Invitation" description={expired ? "The link has expired — resend to send a fresh one." : "Waiting for them to accept."}>
      <dl className="divide-y divide-dash">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
            <dt className="body-xsm-medium text-primary-300">{k}</dt>
            <dd className="min-w-0 truncate text-right body-sm-regular text-primary-500">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 rounded-lg border border-dash bg-gray-bg p-3">
        <p className="body-xsm-medium text-primary-300">Personal message</p>
        <p className="mt-0.5 body-sm-regular text-primary-500">{m.invite.message || <span className="text-primary-300">No message was added.</span>}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CardActionButton icon={<Send />} disabled={busy} onClick={onResend}>
          Resend invite
        </CardActionButton>
        <CardActionButton icon={<XCircle />} disabled={busy} onClick={onRevoke}>
          Revoke
        </CardActionButton>
      </div>
    </IconSectionCard>
  );
}

export default InvitationDetailsCard;
