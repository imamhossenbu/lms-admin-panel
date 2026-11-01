"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, MailPlus, UserPlus } from "lucide-react";
import type { TeamSeed } from "@/types/team";
import { useUrlParams } from "@/lib/useUrlParams";
import { invitations, inviteState } from "@/lib/teamStats";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { INVITE_EXPIRY_DAYS } from "@/validations/teamSchema";
import { TeamEmptyState } from "../shared/TeamEmptyState";
import type { MemberDialogOpeners } from "../shared/useMemberDialogs";
import { InvitationsTable } from "./InvitationsTable";

type InviteFilter = "all" | "pending" | "expired";
const parseFilter = (v: string): InviteFilter => (v === "pending" || v === "expired" ? v : "all");

export interface InvitationsTabProps {
  data: TeamSeed;
  open: MemberDialogOpeners;
  busyId: string | null;
  onInvite: () => void;
}

/** Invitations tab: All / Pending / Expired (?state=), table with Resend / Revoke, empty state with Invite CTA. */
export function InvitationsTab({ data, open, busyId, onInvite }: InvitationsTabProps) {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const filter = parseFilter(get("state"));
  const all = useMemo(() => invitations(data.members).sort((a, b) => Date.parse(b.invite?.sentAt ?? "") - Date.parse(a.invite?.sentAt ?? "")), [data.members]);
  const counts = { all: all.length, pending: all.filter((m) => inviteState(m) === "PENDING").length, expired: all.filter((m) => inviteState(m) === "EXPIRED").length };
  const rows = filter === "all" ? all : all.filter((m) => inviteState(m) === filter.toUpperCase());

  const empty =
    all.length === 0 ? (
      <TeamEmptyState icon={<MailPlus className="h-6 w-6" />} title="No open invitations" message="Everyone you invited has joined. Invite more colleagues to help run the platform." actionLabel="Invite member" actionIcon={<UserPlus className="h-4 w-4" />} onAction={onInvite} />
    ) : (
      <TeamEmptyState icon={<MailPlus className="h-6 w-6" />} title={`No ${filter} invitations`} message="Switch the filter to see the others." isFiltered onReset={() => set({ state: null })} />
    );

  return (
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="body-md-medium font-semibold! text-primary-500">Invitations</h3>
          <p className="body-sm-regular text-primary-300">People who haven&apos;t accepted yet. Links expire after {INVITE_EXPIRY_DAYS} days.</p>
        </div>
        <SegmentedControl<InviteFilter>
          value={filter}
          onChange={(v) => set({ state: v === "all" ? null : v })}
          options={[
            { value: "all", label: `All (${counts.all})` },
            { value: "pending", label: `Pending (${counts.pending})` },
            { value: "expired", label: `Expired (${counts.expired})` },
          ]}
        />
      </div>
      {counts.expired > 0 && filter !== "pending" && (
        <SettingsCallout tone="warning" title={`${counts.expired} invitation${counts.expired === 1 ? " has" : "s have"} expired`}>
          Resend to email a fresh {INVITE_EXPIRY_DAYS}-day link, or revoke to clean up the list.
        </SettingsCallout>
      )}
      <InvitationsTable
        rows={rows}
        roles={data.roles}
        busyId={busyId}
        onView={(m) => router.push(`/users/${m.id}`)}
        onResend={open.resend}
        onRevoke={open.revoke}
        emptyMessage={empty}
      />
      <p className="flex items-center gap-1.5 body-xsm-regular text-primary-300">
        <Clock className="h-3.5 w-3.5" /> Invitees get an email with a sign-up link. They choose their own password and must set up 2FA if your security settings require it.
      </p>
    </section>
  );
}

export default InvitationsTab;
