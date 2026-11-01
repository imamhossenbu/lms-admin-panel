"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { TeamMember, TeamRole } from "@/types/team";
import {
  deleteRole,
  duplicateRole,
  remindTwoFactor,
  removeMember,
  resendInvite,
  resetTwoFactor,
  revokeInvite,
  updateMember,
} from "@/lib/teamStorage";
import { errorText, plural } from "./teamFormat";

const nameOf = (m: TeamMember) => m.name || m.email;

/**
 * Toast-wrapped team mutations (loading → success / error). Each resolves on success and
 * re-throws on failure so ConfirmModal stays open. `busyId` = member/role currently mutating.
 */
export function useTeamActions() {
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = useCallback(async <T,>(id: string, loading: string, fn: () => Promise<T>, ok: (r: T) => { title: string; description?: string }, fail: string) => {
    setBusyId(id);
    const toastId = toast.loading(loading);
    try {
      const r = await fn();
      const msg = ok(r);
      toast.success(msg.title, { id: toastId, description: msg.description });
      return r;
    } catch (err) {
      toast.error(fail, { id: toastId, description: errorText(err) });
      throw err;
    } finally {
      setBusyId(null);
    }
  }, []);

  const changeRole = (m: TeamMember, role: TeamRole) =>
    run(m.id, "Changing role...", () => updateMember(m.id, { roleId: role.id }), () => ({ title: "Role updated", description: `${nameOf(m)} is now ${role.name}.` }), "Couldn't change the role");

  const setSuspended = (m: TeamMember, suspended: boolean, reason?: string) =>
    run(
      m.id,
      suspended ? "Suspending access..." : "Restoring access...",
      () => updateMember(m.id, { status: suspended ? "SUSPENDED" : "ACTIVE", reason }),
      () => (suspended ? { title: "Member suspended", description: `${nameOf(m)} is signed out and can't access the admin panel.` } : { title: "Access restored", description: `${nameOf(m)} can sign in again.` }),
      suspended ? "Couldn't suspend this member" : "Couldn't reactivate this member"
    );

  const remove = (m: TeamMember) =>
    run(m.id, "Removing member...", () => removeMember(m.id), () => ({ title: "Member removed", description: `${nameOf(m)} no longer has access to the admin panel.` }), "Couldn't remove this member");

  const reset2fa = (m: TeamMember) =>
    run(m.id, "Resetting two-factor authentication...", () => resetTwoFactor(m.id), () => ({ title: "2FA reset", description: `${nameOf(m)} will be asked to set up 2FA at their next sign-in.` }), "Couldn't reset 2FA");

  const resend = (m: TeamMember) =>
    run(m.id, "Resending invitation...", () => resendInvite(m.id), () => ({ title: "Invitation sent again", description: `A fresh link was emailed to ${m.email}. It's valid for 7 days.` }), "Couldn't resend the invitation");

  const revoke = (m: TeamMember) =>
    run(m.id, "Revoking invitation...", () => revokeInvite(m.id), () => ({ title: "Invitation revoked", description: `The link sent to ${m.email} no longer works.` }), "Couldn't revoke the invitation");

  const remind2fa = (members: TeamMember[]) =>
    run("remind-2fa", "Sending reminders...", () => remindTwoFactor(members.map((m) => m.id)), (n) => ({ title: "Reminders sent", description: `${plural(n, "member")} will get an email asking them to turn on 2FA.` }), "Couldn't send reminders");

  const duplicate = (r: TeamRole) =>
    run(r.id, "Duplicating role...", () => duplicateRole(r.id), (copy) => ({ title: "Role duplicated", description: `"${copy.name}" is ready to customise.` }), "Couldn't duplicate the role");

  const removeRole = (r: TeamRole) =>
    run(r.id, "Deleting role...", () => deleteRole(r.id), () => ({ title: "Role deleted", description: `"${r.name}" was removed.` }), "Couldn't delete the role");

  return { busyId, changeRole, setSuspended, remove, reset2fa, resend, revoke, remind2fa, duplicate, removeRole };
}

export type TeamActions = ReturnType<typeof useTeamActions>;
export default useTeamActions;
