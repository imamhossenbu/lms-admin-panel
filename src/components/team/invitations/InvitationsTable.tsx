"use client";

import React from "react";
import { Send, XCircle } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { inviteExpiresWithin, inviteState } from "@/lib/teamStats";
import { extraCount } from "@/lib/teamPermissions";
import { MemberIdentity } from "../shared/MemberIdentity";
import { ExtraPermissionsBadge, RoleBadge } from "../shared/TeamBadges";
import { expiresIn, fullDate, timeAgo } from "../shared/teamFormat";

export interface InvitationsTableProps {
  rows: TeamMember[];
  roles: TeamRole[];
  busyId: string | null;
  onView: (m: TeamMember) => void;
  onResend: (m: TeamMember) => void;
  onRevoke: (m: TeamMember) => void;
  emptyMessage: React.ReactNode;
}

/** Pending / expired invitations with inline Resend + Revoke. */
export function InvitationsTable({ rows, roles, busyId, onView, onResend, onRevoke, emptyMessage }: InvitationsTableProps) {
  const columns: ColumnDef<TeamMember>[] = [
    {
      key: "invitee",
      header: "Invitee",
      render: (m) => (
        <div className="min-w-0">
          <MemberIdentity member={m} size={30} />
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "176px",
      render: (m) => (
        <div className="flex min-w-0 items-center gap-1.5">
          <RoleBadge role={roles.find((r) => r.id === m.roleId)} className="min-w-0 max-w-full" />
          <ExtraPermissionsBadge count={extraCount(m)} />
        </div>
      ),
    },
    {
      key: "sent",
      header: "Invited",
      width: "150px",
      render: (m) => (
        <div className="min-w-0">
          <p className="truncate body-sm-regular text-primary-500" title={fullDate(m.invite?.sentAt)}>
            {timeAgo(m.invite?.sentAt)}
          </p>
          <p className="truncate body-xsm-regular text-primary-300" title={`By ${m.invite?.invitedBy}`}>
            by {m.invite?.invitedBy}
            {m.invite && m.invite.resentCount > 0 ? ` · resent ${m.invite.resentCount}×` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      width: "132px",
      render: (m) => {
        if (!m.invite) return null;
        const expired = inviteState(m) === "EXPIRED";
        const soon = inviteExpiresWithin(m, 2 * 86400000);
        return (
          <span title={fullDate(m.invite.expiresAt)}>
            <ToneBadge tone={expired ? "red" : soon ? "yellow" : "gray"} size="sm" variant="pill" dot>
              {expired ? "Expired" : expiresIn(m.invite.expiresAt)}
            </ToneBadge>
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "200px",
      render: (m) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <CardActionButton icon={<Send />} disabled={busyId === m.id} onClick={() => onResend(m)} aria-label={`Resend invitation to ${m.email}`}>
            Resend
          </CardActionButton>
          <CardActionButton icon={<XCircle />} disabled={busyId === m.id} onClick={() => onRevoke(m)} aria-label={`Revoke invitation for ${m.email}`}>
            Revoke
          </CardActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(m) => m.id}
        onRowClick={onView}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-200"
        thClassName="px-2.5 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-2.5 py-2.5"
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

export default InvitationsTable;
