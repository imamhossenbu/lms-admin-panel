"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { TeamSeed } from "@/types/team";
import { apiClient } from "@/lib/api";
import { apiErrorMessage } from "@/lib/apiError";
import { fetchTeam, getTeamSnapshot, isTeamSettled, TEAM_UPDATED_EVENT } from "@/lib/teamStorage";
import { useAppSelector } from "@/store/hooks";

const EMPTY: TeamSeed = { members: [], roles: [], events: [] };

function subscribeTeam(onChange: () => void) {
  const handler = () => queueMicrotask(onChange);
  window.addEventListener(TEAM_UPDATED_EVENT, handler);
  return () => window.removeEventListener(TEAM_UPDATED_EVENT, handler);
}

/** Live TeamSeed (members incl. invitations, roles, events). Empty until the first load. */
export function useTeamStore(): TeamSeed {
  return useSyncExternalStore(subscribeTeam, getTeamSnapshot, () => EMPTY);
}

/**
 * false until the team snapshot request settled (show skeletons until then). Every mount also refreshes
 * the snapshot in the background, so opening a page shows current data.
 */
export function useTeamReady(): boolean {
  useEffect(() => {
    fetchTeam().catch((err) => toast.error("Couldn't load your team", { id: "team-load", description: apiErrorMessage(err) }));
  }, []);
  return useSyncExternalStore(subscribeTeam, isTeamSettled, () => false);
}

/** Settings › Security › "Require 2FA for admins" (from the API; false when settings can't be read). */
export function useRequireAdmin2fa(): boolean {
  const [required, setRequired] = useState(false);
  useEffect(() => {
    let alive = true;
    apiClient
      .get<{ settings: { security: { requireAdmin2fa: boolean } } }>("/admin/settings")
      .then((res) => alive && setRequired(!!res.data.settings?.security?.requireAdmin2fa))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return required;
}

/** The signed-in admin's own team member id (from GET /team/me), or null. */
export function useMyMemberId(): string | null {
  return useAppSelector((s) => s.auth.access?.memberId ?? null);
}

export default useTeamStore;
