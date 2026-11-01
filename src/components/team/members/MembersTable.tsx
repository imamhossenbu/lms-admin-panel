"use client";

import React from "react";
import type { TeamMember, TeamRole } from "@/types/team";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { inviteState, isActiveWithin } from "@/lib/teamStats";
import { MemberIdentity } from "../shared/MemberIdentity";
import { MemberStatusBadge, RoleBadge, TwoFactorBadge } from "../shared/TeamBadges";
import { expiresIn, fullDate, shortDate, timeAgo } from "../shared/teamFormat";
import { MemberRowActions, type MemberRowActionsProps } from "./MemberRowActions";

export interface MembersTableProps {
  rows: TeamMember[];
  roles: TeamRole[];
  open: MemberRowActionsProps["open"];
  busyId: string | null;
  emptyMessage: React.ReactNode;
  footer?: React.ReactNode;
}

const ACTIVE_NOW_MS = 15 * 60000;

function LastActiveCell({ m }: { m: TeamMember }) {
  if (m.status === "INVITED") {
    const expired = inviteState(m) === "EXPIRED";
    return (
      <p className={expired ? "truncate body-xsm-regular text-red" : "truncate body-xsm-regular text-primary-300"} title={m.invite ? `Invite expires ${fullDate(m.invite.expiresAt)}` : undefined}>
        {m.invite ? (expired ? "Invite expired" : `Expires ${expiresIn(m.invite.expiresAt)}`) : "—"}
      </p>
    );
  }
  return isActiveWithin(m, ACTIVE_NOW_MS) ? (
    <ToneBadge tone="green" size="sm" variant="pill" dot>
      Online
    </ToneBadge>
  ) : (
    <span className="whitespace-nowrap body-sm-regular text-primary-500" title={fullDate(m.lastActiveAt)}>
      {timeAgo(m.lastActiveAt)}
    </span>
  );
}

/** Members (fixed layout + explicit widths so it fits laptop widths without horizontal scroll). */
export function MembersTable({ rows, roles, open, busyId, emptyMessage, footer }: MembersTableProps) {
  const columns: ColumnDef<TeamMember>[] = [
    { key: "member", header: "Member", render: (m) => <MemberIdentity member={m} /> },
    { key: "role", header: "Role", width: "150px", render: (m) => <RoleBadge role={roles.find((r) => r.id === m.roleId)} className="max-w-full" /> },
    { key: "status", header: "Status", width: "124px", render: (m) => <MemberStatusBadge member={m} /> },
    { key: "2fa", header: "2FA", width: "70px", align: "center", render: (m) => <TwoFactorBadge member={m} /> },
    { key: "lastActive", header: "Last active", width: "116px", render: (m) => <LastActiveCell m={m} /> },
    {
      key: "joined",
      header: "Joined",
      width: "112px",
      render: (m) => (
        <span className="whitespace-nowrap body-sm-regular text-primary-500" title={fullDate(m.joinedAt ?? m.invite?.sentAt)}>
          {m.joinedAt ? shortDate(m.joinedAt) : <span className="text-primary-300">Pending</span>}
        </span>
      ),
    },
    { key: "actions", header: "Actions", width: "64px", align: "center", render: (m) => <MemberRowActions member={m} open={open} busy={busyId === m.id} /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-dash">
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(m) => m.id}
        onRowClick={(m) => open.view(m)}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-210"
        thClassName="px-2.5 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-2.5 py-2.5"
        emptyMessage={emptyMessage}
      />
      {footer}
    </div>
  );
}

export default MembersTable;
