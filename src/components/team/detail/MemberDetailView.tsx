"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberEvents } from "@/lib/teamStats";
import { useRequireAdmin2fa, useTeamReady, useTeamStore } from "../shared/useTeamStore";
import { useTeamActions } from "../shared/useTeamActions";
import { useMemberDialogs } from "../shared/useMemberDialogs";
import { TeamNotFound } from "../shared/TeamNotFound";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { MemberAccessCard } from "./MemberAccessCard";
import { MemberSecurityCard } from "./MemberSecurityCard";
import { InvitationDetailsCard } from "./InvitationDetailsCard";
import { MemberActivityCard } from "./MemberActivityCard";
import { MemberDetailSkeleton } from "./MemberDetailSkeleton";

/** /users/[id] — profile header + Access (role, read-only matrix), Security (or Invitation) and Activity. */
export function MemberDetailView({ memberId }: { memberId: string }) {
  const router = useRouter();
  const ready = useTeamReady();
  const data = useTeamStore();
  const require2fa = useRequireAdmin2fa();
  const actions = useTeamActions();
  const { open, dialogs } = useMemberDialogs(data.roles, actions, { onRemoved: () => router.push("/users") });
  const member = data.members.find((m) => m.id === memberId);
  const events = useMemo(() => (member ? memberEvents(data.events, member) : []), [data.events, member]);
  const linkable = useMemo(() => new Set([...data.members.map((m) => m.id), ...data.roles.map((r) => r.id)]), [data.members, data.roles]);

  if (!ready) return <MemberDetailSkeleton />;
  if (!member) return <TeamNotFound what="member" />;

  const role = data.roles.find((r) => r.id === member.roleId);
  const busy = actions.busyId === member.id;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <MemberProfileHeader member={member} role={role} open={open} busy={busy} />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <MemberAccessCard member={member} role={role} onChangeRole={() => open.changeRole(member)} />
        </div>
        <aside className="min-w-0 space-y-5 xl:col-span-4">
          {member.status === "INVITED" ? (
            <InvitationDetailsCard member={member} busy={busy} onResend={() => open.resend(member)} onRevoke={() => open.revoke(member)} />
          ) : (
            <MemberSecurityCard member={member} require2fa={require2fa} busy={busy} onReset2fa={() => open.reset2fa(member)} />
          )}
          <MemberActivityCard events={events} searchName={member.name || member.email} linkableIds={linkable} />
        </aside>
      </div>
      {dialogs}
    </motion.div>
  );
}

export default MemberDetailView;
