"use client";

import React, { useState } from "react";
import { Ban, ShieldOff, Trash2, XCircle } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import type { TeamActions } from "./useTeamActions";

type Pending = { kind: "suspend" | "remove" | "reset2fa" | "revoke"; member: TeamMember } | null;

const nameOf = (m: TeamMember) => m.name || m.email;

/**
 * Member action dialogs shared by the Members table, Invitations table and member detail page:
 * Change role (modal), Suspend / Remove / Reset 2FA / Revoke invite (ConfirmModal). Reactivate and Resend run directly.
 */
export function useMemberDialogs(roles: TeamRole[], actions: TeamActions, opts: { onRemoved?: () => void } = {}) {
  const [changing, setChanging] = useState<TeamMember | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? "their role";

  const open = {
    changeRole: (m: TeamMember) => setChanging(m),
    suspend: (m: TeamMember) => setPending({ kind: "suspend", member: m }),
    reactivate: (m: TeamMember) => void actions.setSuspended(m, false).catch(() => {}),
    remove: (m: TeamMember) => setPending({ kind: "remove", member: m }),
    reset2fa: (m: TeamMember) => setPending({ kind: "reset2fa", member: m }),
    revoke: (m: TeamMember) => setPending({ kind: "revoke", member: m }),
    resend: (m: TeamMember) => void actions.resend(m).catch(() => {}),
  };

  const m = pending?.member;
  const confirm = pending && m
    ? {
        suspend: {
          title: "Suspend member?",
          subtitle: nameOf(m),
          message: `${nameOf(m)} will be signed out everywhere and can't access the admin panel until reactivated. Their role (${roleName(m.roleId)}) and history are kept.`,
          confirmLabel: "Suspend",
          pendingLabel: "Suspending...",
          icon: <Ban className="h-4 w-4" />,
          run: () => actions.setSuspended(m, true),
        },
        remove: {
          title: "Remove from team?",
          subtitle: nameOf(m),
          message: `${nameOf(m)} loses all admin access immediately. Their past activity stays in the log. To bring them back you'll need to send a new invitation.`,
          confirmLabel: "Remove member",
          pendingLabel: "Removing...",
          icon: <Trash2 className="h-4 w-4" />,
          run: async () => {
            await actions.remove(m);
            opts.onRemoved?.();
          },
        },
        reset2fa: {
          title: "Reset two-factor authentication?",
          subtitle: nameOf(m),
          message: `Their authenticator app stops working. ${nameOf(m)} must set up 2FA again the next time they sign in. Use this when they lose their phone.`,
          confirmLabel: "Reset 2FA",
          pendingLabel: "Resetting...",
          icon: <ShieldOff className="h-4 w-4" />,
          run: () => actions.reset2fa(m),
        },
        revoke: {
          title: "Revoke invitation?",
          subtitle: m.email,
          message: `The invitation link stops working right away. You can invite ${m.email} again later.`,
          confirmLabel: "Revoke invite",
          pendingLabel: "Revoking...",
          icon: <XCircle className="h-4 w-4" />,
          run: async () => {
            await actions.revoke(m);
            opts.onRemoved?.();
          },
        },
      }[pending.kind]
    : null;

  const dialogs = (
    <>
      <ChangeRoleModal member={changing} roles={roles} onClose={() => setChanging(null)} onSubmit={(mem, role) => actions.changeRole(mem, role)} />
      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.title ?? ""}
        subtitle={confirm?.subtitle}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        pendingLabel={confirm?.pendingLabel}
        confirmIcon={confirm?.icon}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await confirm?.run();
        }}
      />
    </>
  );

  return { open, dialogs };
}

export type MemberDialogOpeners = ReturnType<typeof useMemberDialogs>["open"];
export default useMemberDialogs;
