import type { RolePermissions, TeamMember, TeamRole, TeamSeed } from "@/types/team";
import type { RoleFormValues } from "@/validations/teamSchema";
import { apiClient } from "@/lib/api";
import { refreshWorkspaceSaas } from "@/lib/workspaceSaas";

/**
 * Team & Roles data layer, backed by the Team API (`/team*`, workspace-scoped, permission-checked).
 *
 * Reads: `GET /team` returns `{ members, roles, events }` (the panel's TeamSeed). It's cached in memory.
 * `getTeamSnapshot()` is sync and returns the same object until the next refresh. `fetchTeam()` loads or
 * refreshes it; TEAM_UPDATED_EVENT fires after every refresh.
 * Mutations call the API, then refresh the snapshot (also after a failure). They throw Axios errors;
 * callers turn them into friendly toasts with `apiErrorMessage`.
 */

export const TEAM_UPDATED_EVENT = "edupro_team_updated";

const EMPTY: TeamSeed = { members: [], roles: [], events: [] };
let store: TeamSeed = EMPTY;
let settled = false;
let inflight: Promise<TeamSeed> | null = null;

const notify = () => typeof window !== "undefined" && window.dispatchEvent(new Event(TEAM_UPDATED_EVENT));

// ---------------------------------------------------------------- reads

export const getTeamSnapshot = () => store;
/** True once the first snapshot request finished (even when it failed). */
export const isTeamSettled = () => settled;

/** Loads the team snapshot. Concurrent calls share one request. */
export function fetchTeam(): Promise<TeamSeed> {
  inflight ??= apiClient
    .get<TeamSeed>("/team")
    .then((res) => {
      store = res.data;
      return store;
    })
    .finally(() => {
      inflight = null;
      settled = true;
      notify();
    });
  return inflight;
}

export async function fetchMember(id: string): Promise<TeamMember | null> {
  return (await fetchTeam()).members.find((m) => m.id === id) ?? null;
}
export async function fetchRole(id: string): Promise<TeamRole | null> {
  return (await fetchTeam()).roles.find((r) => r.id === id) ?? null;
}

/** Emails already on the team (members + invitations), lower-case — for duplicate checks. */
export const teamEmails = (d: TeamSeed = store) => d.members.map((m) => m.email.toLowerCase());

async function mutate<T>(call: () => Promise<{ data: T }>): Promise<T> {
  try {
    return (await call()).data;
  } finally {
    await fetchTeam().catch(() => undefined);
    void refreshWorkspaceSaas().catch(() => undefined); // team size counts toward the plan limit
  }
}

const enc = encodeURIComponent;

// ---------------------------------------------------------------- invitations

/** Invites people to a role, optionally with extra permissions on top (the API prunes them against the role). */
export const inviteMembers = (emails: string[], roleId: string, message: string, extraPermissions?: Partial<RolePermissions>) =>
  mutate(() => apiClient.post<TeamMember[]>("/team/invitations", { emails, roleId, message, ...(extraPermissions ? { extraPermissions } : {}) }));

/** New link + 7 more days. */
export const resendInvite = (id: string) => mutate(() => apiClient.post<TeamMember>(`/team/invitations/${enc(id)}/resend`));

export const revokeInvite = (id: string) => mutate(() => apiClient.delete<{ id: string }>(`/team/invitations/${enc(id)}`));

// ---------------------------------------------------------------- members

export interface MemberPatch {
  roleId?: string;
  status?: "ACTIVE" | "SUSPENDED";
  reason?: string;
}

export const updateMember = (id: string, patch: MemberPatch) => mutate(() => apiClient.patch<TeamMember>(`/team/members/${enc(id)}`, patch));

/** Removes a member (their account is deactivated). */
export const removeMember = (id: string) => mutate(() => apiClient.delete<{ id: string; removed: true }>(`/team/members/${enc(id)}`));

/** Replaces a member's extra permissions (the API prunes them against the role). */
export const setMemberExtraPermissions = (id: string, extraPermissions: Partial<RolePermissions>) =>
  mutate(() => apiClient.put<TeamMember>(`/team/members/${enc(id)}/extra-permissions`, { extraPermissions }));

/** Turns 2FA off for a member (lost phone); they set it up again at next sign-in. */
export const resetTwoFactor = (id: string) => mutate(() => apiClient.post<TeamMember>(`/team/members/${enc(id)}/reset-2fa`));

/** Emails the given active members without 2FA. Resolves to how many were reminded. */
export const remindTwoFactor = async (ids: string[]) => (await mutate(() => apiClient.post<{ reminded: number }>("/team/2fa-reminders", { memberIds: ids }))).reminded;

// ---------------------------------------------------------------- roles

const roleBody = (v: RoleFormValues) => ({ name: v.name.trim(), description: v.description.trim(), tone: v.tone, permissions: v.permissions });

export const createRole = (v: RoleFormValues) => mutate(() => apiClient.post<TeamRole>("/team/roles", roleBody(v)));

export const updateRole = (id: string, v: RoleFormValues) => mutate(() => apiClient.put<TeamRole>(`/team/roles/${enc(id)}`, roleBody(v)));

/** System roles only: back to the built-in permissions. */
export const resetRoleToDefault = (id: string) => mutate(() => apiClient.post<TeamRole>(`/team/roles/${enc(id)}/reset`));

/** Custom roles with no members (and no pending invites) only. */
export const deleteRole = (id: string) => mutate(() => apiClient.delete<{ id: string }>(`/team/roles/${enc(id)}`));

export const duplicateRole = (id: string) => mutate(() => apiClient.post<TeamRole>(`/team/roles/${enc(id)}/duplicate`));
