"use client";

import React from "react";
import { Building2, Mail, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { InvitationPreview } from "@/lib/api/team";

/** Who invited you, to which workspace, as which role. */
export function InvitePreviewCard({ invite }: { invite: InvitationPreview }) {
  const expires = new Date(invite.expiresAt).toLocaleDateString("en-US", { dateStyle: "medium" });
  return (
    <div className="space-y-3 rounded-xl border border-dash bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-brand-orange" />
          <p className="truncate body-sm-medium text-primary-500">{invite.workspaceName}</p>
        </div>
        <ToneBadge tone="orange">{invite.roleName}</ToneBadge>
      </div>
      <div className="flex items-center gap-2 body-xsm-regular text-primary-400">
        <Mail className="h-4 w-4 shrink-0 text-primary-300" />
        <span className="truncate">{invite.email}</span>
      </div>
      <div className="flex items-center gap-2 body-xsm-regular text-primary-400">
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary-300" />
        <span>
          Invited by <span className="body-xsm-medium text-primary-500">{invite.invitedBy}</span> · link valid until {expires}
        </span>
      </div>
      {invite.message && (
        <div className="flex gap-2 rounded-lg border border-dash bg-white p-3 body-xsm-regular text-primary-400">
          <MessageSquareQuote className="h-4 w-4 shrink-0 text-brand-orange" />
          <p className="whitespace-pre-line">{invite.message}</p>
        </div>
      )}
    </div>
  );
}

export default InvitePreviewCard;
