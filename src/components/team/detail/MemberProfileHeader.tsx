"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ban, CalendarDays, Clock, Mail, MapPin, RotateCcw, Send, Trash2, UserCog, XCircle } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ExtraPermissionsBadge, MemberStatusBadge, OwnerBadge, RoleBadge } from "../shared/TeamBadges";
import { extraCount } from "@/lib/teamPermissions";
import { fullDate, shortDate, timeAgo } from "../shared/teamFormat";
import type { MemberDialogOpeners } from "../shared/useMemberDialogs";
import { useMyMemberId } from "../shared/useTeamStore";

export interface MemberProfileHeaderProps {
  member: TeamMember;
  role: TeamRole | undefined;
  open: MemberDialogOpeners;
  busy: boolean;
}

function Meta({ icon, children, title }: { icon: React.ReactNode; children: React.ReactNode; title?: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 body-sm-regular text-primary-400" title={title}>
      <span className="shrink-0 text-primary-300">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Breadcrumb + profile banner: avatar, name, Owner/role/status badges, contact + dates, header actions. */
export function MemberProfileHeader({ member: m, role, open, busy }: MemberProfileHeaderProps) {
  const invited = m.status === "INVITED";
  const isSelf = useMyMemberId() === m.id;
  const title = invited ? m.email : m.name;
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Team & Roles", href: invited ? "/users?tab=invitations" : "/users" }, { label: title }]} />
      <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="dashboard-card shadow-2xs flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {invited ? (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-yellow/60 bg-yellow-bg text-yellow">
              <Mail className="h-7 w-7" />
            </span>
          ) : (
            <Avatar name={m.name} size={64} className="ring-4 ring-brand-orange-light" />
          )}
          <div className="min-w-0 space-y-1.5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="truncate heading-h4 font-bold! text-primary-500" title={title}>
                {title}
              </h1>
              {m.isOwner && <OwnerBadge size="md" />}
              <RoleBadge role={role} size="md" />
              <ExtraPermissionsBadge count={extraCount(m)} size="md" />
              <MemberStatusBadge member={m} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {!invited && <Meta icon={<Mail className="h-3.5 w-3.5" />}>{m.email}</Meta>}
              {invited && m.invite && (
                <Meta icon={<Send className="h-3.5 w-3.5" />} title={fullDate(m.invite.sentAt)}>
                  Invited {timeAgo(m.invite.sentAt).toLowerCase()} by {m.invite.invitedBy}
                </Meta>
              )}
              {m.joinedAt && (
                <Meta icon={<CalendarDays className="h-3.5 w-3.5" />} title={fullDate(m.joinedAt)}>
                  Joined {shortDate(m.joinedAt)}
                </Meta>
              )}
              {!invited && (
                <Meta icon={<Clock className="h-3.5 w-3.5" />} title={fullDate(m.lastActiveAt)}>
                  Last active {timeAgo(m.lastActiveAt).toLowerCase()}
                </Meta>
              )}
              {m.location && <Meta icon={<MapPin className="h-3.5 w-3.5" />}>{m.location}</Meta>}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {m.isOwner ? (
            <ToneBadge tone="gray" size="lg">
              The workspace owner can&apos;t be changed or removed
            </ToneBadge>
          ) : isSelf ? (
            <ToneBadge tone="gray" size="lg">
              This is you — ask another admin to change your access
            </ToneBadge>
          ) : invited ? (
            <>
              <SecondaryButton leftIcon={<UserCog className="h-4 w-4" />} disabled={busy} onClick={() => open.changeRole(m)}>
                Change role
              </SecondaryButton>
              <SecondaryButton leftIcon={<Send className="h-4 w-4" />} disabled={busy} onClick={() => open.resend(m)}>
                Resend invite
              </SecondaryButton>
              <SecondaryButton leftIcon={<XCircle className="h-4 w-4 text-red" />} disabled={busy} onClick={() => open.revoke(m)}>
                Revoke
              </SecondaryButton>
            </>
          ) : (
            <>
              <SecondaryButton leftIcon={<UserCog className="h-4 w-4" />} disabled={busy} onClick={() => open.changeRole(m)}>
                Change role
              </SecondaryButton>
              {m.status === "SUSPENDED" ? (
                <SecondaryButton leftIcon={<RotateCcw className="h-4 w-4" />} disabled={busy} onClick={() => open.reactivate(m)}>
                  Reactivate
                </SecondaryButton>
              ) : (
                <SecondaryButton leftIcon={<Ban className="h-4 w-4" />} disabled={busy} onClick={() => open.suspend(m)}>
                  Suspend
                </SecondaryButton>
              )}
              <SecondaryButton leftIcon={<Trash2 className="h-4 w-4 text-red" />} disabled={busy} onClick={() => open.remove(m)}>
                Remove
              </SecondaryButton>
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
}

export default MemberProfileHeader;
