"use client";

import React from "react";
import { Ban, Eye, RotateCcw, Send, ShieldOff, Trash2, UserCog, XCircle } from "lucide-react";
import type { TeamMember } from "@/types/team";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import type { MemberDialogOpeners } from "../shared/useMemberDialogs";

const ICON = "h-3.5 w-3.5 text-primary-400";

/** ⋮ items. Owner: view only. Invitation: change role / resend / revoke. Member: change role, suspend|reactivate, reset 2FA, remove. */
export function memberMenuItems(m: TeamMember, open: MemberDialogOpeners & { view: (m: TeamMember) => void }, busy: boolean): DropdownActionItem[] {
  const view: DropdownActionItem = { key: "view", label: m.status === "INVITED" ? "View invitation" : "View profile", icon: <Eye className={ICON} />, onClick: () => open.view(m) };
  if (m.isOwner) return [view, { key: "owner", label: "Owner can't be changed", icon: <UserCog className={ICON} />, disabled: true }];
  if (m.status === "INVITED")
    return [
      view,
      { key: "role", label: "Change role", icon: <UserCog className={ICON} />, disabled: busy, onClick: () => open.changeRole(m) },
      { key: "resend", label: "Resend invite", icon: <Send className={ICON} />, disabled: busy, onClick: () => open.resend(m) },
      { key: "revoke", label: "Revoke invite", icon: <XCircle className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => open.revoke(m) },
    ];
  return [
    view,
    { key: "role", label: "Change role", icon: <UserCog className={ICON} />, disabled: busy, onClick: () => open.changeRole(m) },
    m.status === "SUSPENDED"
      ? { key: "reactivate", label: "Reactivate", icon: <RotateCcw className={ICON} />, disabled: busy, onClick: () => open.reactivate(m) }
      : { key: "suspend", label: "Suspend", icon: <Ban className={ICON} />, disabled: busy, onClick: () => open.suspend(m) },
    { key: "2fa", label: "Reset 2FA", icon: <ShieldOff className={ICON} />, disabled: busy || !m.twoFactorEnabled, onClick: () => open.reset2fa(m) },
    { key: "remove", label: "Remove from team", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => open.remove(m) },
  ];
}

export interface MemberRowActionsProps {
  member: TeamMember;
  open: MemberDialogOpeners & { view: (m: TeamMember) => void };
  busy: boolean;
}

export function MemberRowActions({ member, open, busy }: MemberRowActionsProps) {
  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <RowMoreMenu size="sm" label={`More actions for ${member.name || member.email}`} items={memberMenuItems(member, open, busy)} />
    </div>
  );
}

export default MemberRowActions;
