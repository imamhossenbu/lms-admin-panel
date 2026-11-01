import type { InviteStatus, RolePermissions, TeamEvent, TeamMember, TeamRole, TeamSeed } from "@/types/team";
import { countPermissions, effectivePermissions, extraCount, isRoleModified } from "@/lib/teamPermissions";

/** Derived numbers for /users (stat row, tab counts, role cards). Pure — pass `now` in tests. */

const DAY = 86400000;

/** Effective invitation state: a PENDING invite whose expiry has passed counts as EXPIRED. */
export function inviteState(m: TeamMember, now: number = Date.now()): InviteStatus | null {
  if (m.status !== "INVITED" || !m.invite) return null;
  return m.invite.status === "EXPIRED" || Date.parse(m.invite.expiresAt) <= now ? "EXPIRED" : "PENDING";
}

/** Joined staff (active + suspended) — invitations aren't members yet. */
export const joinedMembers = (members: TeamMember[]) => members.filter((m) => m.status !== "INVITED");
export const invitations = (members: TeamMember[]) => members.filter((m) => m.status === "INVITED");

/** Pending invitation that expires within `ms`. */
export const inviteExpiresWithin = (m: TeamMember, ms: number, now: number = Date.now()) =>
  inviteState(m, now) === "PENDING" && !!m.invite && Date.parse(m.invite.expiresAt) - now < ms;

export const isActiveWithin = (m: TeamMember, ms: number, now: number = Date.now()) => m.status === "ACTIVE" && !!m.lastActiveAt && now - Date.parse(m.lastActiveAt) <= ms;

export interface TeamStats {
  members: number;
  active: number;
  suspended: number;
  activeLast24h: number;
  activeNow: number;
  pendingInvites: number;
  expiredInvites: number;
  twoFaEnabled: number;
  /** % of ACTIVE members with 2FA (0–100). */
  twoFaCoverage: number;
  /** Active members without 2FA (shown in the "2FA required" callout). */
  without2fa: TeamMember[];
  customRoles: number;
  /** System roles whose permissions differ from their default preset. */
  modifiedRoles: number;
  /** Members + invitations holding extra permissions on top of their role. */
  membersWithExtras: number;
  /** Extra grants across the whole team. */
  extraGrants: number;
}

export function teamStats(seed: Pick<TeamSeed, "members" | "roles">, now: number = Date.now()): TeamStats {
  const joined = joinedMembers(seed.members);
  const active = joined.filter((m) => m.status === "ACTIVE");
  const invites = invitations(seed.members);
  const twoFa = active.filter((m) => m.twoFactorEnabled);
  return {
    members: joined.length,
    active: active.length,
    suspended: joined.length - active.length,
    activeLast24h: active.filter((m) => isActiveWithin(m, DAY, now)).length,
    activeNow: active.filter((m) => isActiveWithin(m, 15 * 60000, now)).length,
    pendingInvites: invites.filter((m) => inviteState(m, now) === "PENDING").length,
    expiredInvites: invites.filter((m) => inviteState(m, now) === "EXPIRED").length,
    twoFaEnabled: twoFa.length,
    twoFaCoverage: active.length ? Math.round((twoFa.length / active.length) * 100) : 100,
    without2fa: active.filter((m) => !m.twoFactorEnabled),
    customRoles: seed.roles.filter((r) => !r.isSystem).length,
    modifiedRoles: seed.roles.filter(isRoleModified).length,
    membersWithExtras: seed.members.filter((m) => extraCount(m) > 0).length,
    extraGrants: seed.members.reduce((n, m) => n + extraCount(m), 0),
  };
}

/** Everyone holding each role (joined + invited), keyed by role id. */
export function membersByRole(members: TeamMember[]): Record<string, TeamMember[]> {
  return members.reduce<Record<string, TeamMember[]>>((acc, m) => {
    (acc[m.roleId] ??= []).push(m);
    return acc;
  }, {});
}

/** System roles first (seed order), then custom roles by name. */
export const sortRoles = (roles: TeamRole[]) => [...roles.filter((r) => r.isSystem), ...roles.filter((r) => !r.isSystem).sort((a, b) => a.name.localeCompare(b.name))];

/** Events about a member (as the target or the actor). */
export const memberEvents = (events: TeamEvent[], m: TeamMember) =>
  events.filter((e) => e.targetId === m.id || (!!m.name && e.actor === m.name)).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));

/** Effective permissions of a member (role ∪ extras; owner / Super Admin → everything). */
export const memberPermissions = (m: TeamMember, roles: TeamRole[]): RolePermissions => effectivePermissions(m, roles.find((r) => r.id === m.roleId));

/** Number of effective permissions of a member. */
export const memberPermissionCount = (m: TeamMember, roles: TeamRole[]) => countPermissions(memberPermissions(m, roles));
