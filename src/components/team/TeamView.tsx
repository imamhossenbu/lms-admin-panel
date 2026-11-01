"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { teamStats } from "@/lib/teamStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { PillTabs } from "@/components/ui/PillTabs";
import { useRequireAdmin2fa, useTeamReady, useTeamStore } from "./shared/useTeamStore";
import { useTeamActions } from "./shared/useTeamActions";
import { useMemberDialogs } from "./shared/useMemberDialogs";
import { TEAM_TABS, parseTeamTab, type TeamTab } from "./teamTabs";
import { TeamHeader } from "./TeamHeader";
import { TeamSkeleton } from "./TeamSkeleton";
import { TeamStatsRow } from "./TeamStatsRow";
import { TwoFactorCallout } from "./TwoFactorCallout";
import { MembersTab } from "./members/MembersTab";
import { InvitationsTab } from "./invitations/InvitationsTab";
import { RolesTab } from "./roles/RolesTab";
import { ActivityTab } from "./activity/ActivityTab";
import { InviteMemberModal } from "./invite/InviteMemberModal";

/** /users — Team & Roles: Members / Invitations / Roles & permissions / Activity. Tab + filters live in the URL. Render inside <Suspense>. */
export function TeamView() {
  const { get, set } = useUrlParams();
  const ready = useTeamReady();
  const data = useTeamStore();
  const require2fa = useRequireAdmin2fa();
  const actions = useTeamActions();
  const { open, dialogs } = useMemberDialogs(data.roles, actions);
  const [inviting, setInviting] = useState(false);
  const tab = parseTeamTab(get("tab"));
  const stats = useMemo(() => teamStats(data), [data]);

  if (!ready) return <TeamSkeleton tab={tab} />;

  const counts: Record<TeamTab, number> = {
    members: stats.members,
    invitations: stats.pendingInvites + stats.expiredInvites,
    roles: data.roles.length,
    activity: data.events.length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <TeamHeader onInvite={() => setInviting(true)} />
      <TeamStatsRow stats={stats} require2fa={require2fa} />
      {require2fa && <TwoFactorCallout members={stats.without2fa} busy={actions.busyId === "remind-2fa"} onRemind={() => void actions.remind2fa(stats.without2fa).catch(() => {})} />}

      <PillTabs<TeamTab>
        ariaLabel="Team sections"
        idPrefix="team"
        tabs={TEAM_TABS.map((t) => ({ ...t, count: t.id === "activity" ? undefined : counts[t.id] }))}
        activeId={tab}
        onChange={(next) => set({ tab: next === "members" ? null : next }, { replaceAll: true })}
      />

      <motion.div
        key={tab}
        role="tabpanel"
        id={`team-panel-${tab}`}
        aria-labelledby={`team-tab-${tab}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {tab === "members" && <MembersTab data={data} open={open} busyId={actions.busyId} onInvite={() => setInviting(true)} />}
        {tab === "invitations" && <InvitationsTab data={data} open={open} busyId={actions.busyId} onInvite={() => setInviting(true)} />}
        {tab === "roles" && <RolesTab data={data} actions={actions} />}
        {tab === "activity" && <ActivityTab data={data} />}
      </motion.div>

      {dialogs}
      <InviteMemberModal isOpen={inviting} data={data} onClose={() => setInviting(false)} />
    </motion.div>
  );
}

export default TeamView;
