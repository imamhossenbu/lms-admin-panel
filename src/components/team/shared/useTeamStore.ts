"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { TeamSeed } from "@/types/team";
import { getTeamSnapshot, TEAM_UPDATED_EVENT } from "@/lib/teamStorage";
import { getSettingsSnapshot, SETTINGS_UPDATED_EVENT } from "@/lib/settingsStorage";

const EMPTY_SNAPSHOT = JSON.stringify({ members: [], roles: [], events: [] } satisfies TeamSeed);

/** Serialized store, recomputed only after a TEAM_UPDATED_EVENT (avoids re-reading localStorage every render). */
let cached: string | null = null;
let listening = false;
const invalidate = () => {
  cached = null;
};

function getSnapshot(): string {
  if (typeof window !== "undefined" && !listening) {
    window.addEventListener(TEAM_UPDATED_EVENT, invalidate);
    listening = true;
  }
  if (cached === null) cached = JSON.stringify(getTeamSnapshot());
  return cached;
}

/** Deferred a microtask so first-visit seeding during another render never warns. */
function subscribeTeam(onChange: () => void) {
  const handler = () => {
    invalidate();
    queueMicrotask(onChange);
  };
  window.addEventListener(TEAM_UPDATED_EVENT, handler);
  return () => window.removeEventListener(TEAM_UPDATED_EVENT, handler);
}

/** Live TeamSeed (members incl. invitations, roles, events). Empty on the server / during hydration. */
export function useTeamStore(): TeamSeed {
  const snapshot = useSyncExternalStore(subscribeTeam, getSnapshot, () => EMPTY_SNAPSHOT);
  return useMemo(() => JSON.parse(snapshot) as TeamSeed, [snapshot]);
}

const noopSubscribe = () => () => {};

/** false on the server and during hydration, true once the client store can be read (show skeletons until then). */
export function useTeamReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function subscribeSettings(onChange: () => void) {
  const handler = () => queueMicrotask(onChange);
  window.addEventListener(SETTINGS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handler);
}

/** Settings › Security › "Require 2FA for admins" (live). */
export function useRequireAdmin2fa(): boolean {
  return useSyncExternalStore(subscribeSettings, () => !!getSettingsSnapshot().settings.security.requireAdmin2fa, () => false);
}

export default useTeamStore;
