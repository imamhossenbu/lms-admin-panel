import type { MemberStatus, RolePermissions, TeamEvent, TeamEventType, TeamMember, TeamRole, TeamSeed } from "@/types/team";
import type { RoleFormValues } from "@/validations/teamSchema";
import { INVITE_EXPIRY_DAYS, isValidEmail } from "@/validations/teamSchema";
import { buildTeamSeed, OWNER_NAME, SUPER_ADMIN_ROLE_ID } from "@/data/mockTeamData";
import {
  ACTION_LABEL,
  MODULE_LABEL,
  countPermissions,
  emptyPermissions,
  isRoleModified,
  listGrants,
  modulesWithAccess,
  normalizeExtras,
  normalizePermissions,
  samePermissions,
  subtractPermissions,
} from "@/lib/teamPermissions";
import { TEAM_MODULES } from "@/types/team";

/**
 * Mock-first persistence for Team & Roles (localStorage + simulated latency).
 * /users, /users/[id] and the role editor all read this store and listen to TEAM_UPDATED_EVENT.
 * Every mutation appends to the activity log. The signed-in admin is the owner (OWNER_NAME, Super Admin).
 * v2: system roles keep `defaultPermissions` (editable + resettable), members carry additive `extraPermissions`.
 */

const STORAGE_KEY = "edupro_team_v2";
export const TEAM_UPDATED_EVENT = "edupro_team_updated";
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const DAY = 86400000;
const ACTOR = OWNER_NAME;

function read(): TeamSeed {
  if (typeof window === "undefined") return buildTeamSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as TeamSeed;
      if (
        Array.isArray(p?.members) &&
        Array.isArray(p?.roles) &&
        Array.isArray(p?.events) &&
        p.members.every((m) => m && typeof m.extraPermissions === "object") &&
        p.roles.every((r) => r && "defaultPermissions" in r)
      )
        return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildTeamSeed();
  write(seed);
  return seed;
}

function write(d: TeamSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(TEAM_UPDATED_EVENT));
}

const event = (type: TeamEventType, targetId: string | null, targetName: string, detail: string): TeamEvent => ({
  id: uid("team-ev"),
  type,
  actor: ACTOR,
  targetId,
  targetName,
  detail,
  at: new Date().toISOString(),
});

const withEvents = (d: TeamSeed, ...events: TeamEvent[]): TeamSeed => ({ ...d, events: [...events, ...d.events].slice(0, 300) });
const displayName = (m: TeamMember) => m.name || m.email;
const roleName = (d: TeamSeed, id: string) => d.roles.find((r) => r.id === id)?.name ?? "Unknown role";

function getMember(d: TeamSeed, id: string) {
  const m = d.members.find((x) => x.id === id);
  if (!m) throw new Error("This team member no longer exists.");
  return m;
}
function getRole(d: TeamSeed, id: string) {
  const r = d.roles.find((x) => x.id === id);
  if (!r) throw new Error("This role no longer exists.");
  return r;
}

// ---------------------------------------------------------------- reads
export const getTeamSnapshot = () => read();
export async function fetchTeam(): Promise<TeamSeed> {
  await wait(250);
  return read();
}
export async function fetchMember(id: string): Promise<TeamMember | null> {
  await wait(250);
  return read().members.find((m) => m.id === id) ?? null;
}
export async function fetchRole(id: string): Promise<TeamRole | null> {
  await wait(250);
  return read().roles.find((r) => r.id === id) ?? null;
}

// ---------------------------------------------------------------- invitations
/** Emails already on the team (members + invitations), lower-case — for duplicate checks. */
export const teamEmails = (d: TeamSeed = read()) => d.members.map((m) => m.email.toLowerCase());

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const extrasSuffix = (extras: RolePermissions) => (countPermissions(extras) ? ` + ${plural(countPermissions(extras), "extra permission")}` : "");

/** Invites people to a role, optionally with extra permissions on top (pruned against the role). */
export async function inviteMembers(emails: string[], roleId: string, message: string, extraPermissions?: Partial<RolePermissions>): Promise<TeamMember[]> {
  await wait(700);
  const d = read();
  const role = getRole(d, roleId);
  if (role.id === SUPER_ADMIN_ROLE_ID || role.isLocked) throw new Error("Super Admin can't be assigned by invitation.");
  const extras = normalizeExtras(extraPermissions, role.permissions);
  const taken = new Set(teamEmails(d));
  const clean = Array.from(new Set(emails.map((e) => e.trim().toLowerCase())));
  const invalid = clean.find((e) => !isValidEmail(e));
  if (invalid) throw new Error(`"${invalid}" isn't a valid email address.`);
  const dup = clean.find((e) => taken.has(e));
  if (dup) throw new Error(`${dup} is already on the team or invited.`);
  if (clean.length === 0) throw new Error("Add at least one email address.");

  const now = Date.now();
  const created: TeamMember[] = clean.map((email) => ({
    id: uid("member"),
    name: "",
    email,
    roleId,
    extraPermissions: structuredClone(extras),
    status: "INVITED",
    isOwner: false,
    twoFactorEnabled: false,
    lastActiveAt: null,
    lastLoginIp: "",
    location: "",
    joinedAt: null,
    invite: { status: "PENDING", sentAt: new Date(now).toISOString(), expiresAt: new Date(now + INVITE_EXPIRY_DAYS * DAY).toISOString(), message: message.trim(), invitedBy: ACTOR, resentCount: 0 },
  }));
  write(withEvents({ ...d, members: [...d.members, ...created] }, ...created.map((m) => event("INVITED", m.id, m.email, `as ${role.name}${extrasSuffix(extras)}`))));
  return created;
}

/** Sends a fresh link: back to PENDING with a new 7-day expiry. */
export async function resendInvite(id: string): Promise<TeamMember> {
  await wait(600);
  const d = read();
  const m = getMember(d, id);
  if (m.status !== "INVITED" || !m.invite) throw new Error("This person has already joined the team.");
  const now = Date.now();
  const next: TeamMember = {
    ...m,
    invite: { ...m.invite, status: "PENDING", sentAt: new Date(now).toISOString(), expiresAt: new Date(now + INVITE_EXPIRY_DAYS * DAY).toISOString(), resentCount: m.invite.resentCount + 1 },
  };
  write(withEvents({ ...d, members: d.members.map((x) => (x.id === id ? next : x)) }, event("INVITE_RESENT", id, m.email, `New link valid for ${INVITE_EXPIRY_DAYS} days`)));
  return next;
}

export async function revokeInvite(id: string) {
  await wait();
  const d = read();
  const m = getMember(d, id);
  if (m.status !== "INVITED") throw new Error("This person has already joined. Remove them from the team instead.");
  write(withEvents({ ...d, members: d.members.filter((x) => x.id !== id) }, event("INVITE_REVOKED", null, m.email, `${roleName(d, m.roleId)} invitation cancelled`)));
}

// ---------------------------------------------------------------- members
export interface MemberPatch {
  roleId?: string;
  status?: Exclude<MemberStatus, "INVITED">;
  reason?: string;
}

export async function updateMember(id: string, patch: MemberPatch): Promise<TeamMember> {
  await wait();
  const d = read();
  const m = getMember(d, id);
  const events: TeamEvent[] = [];
  let next = { ...m };

  if (patch.roleId && patch.roleId !== m.roleId) {
    if (m.isOwner) throw new Error("The workspace owner always stays Super Admin.");
    const to = getRole(d, patch.roleId);
    if (to.id === SUPER_ADMIN_ROLE_ID && m.status === "INVITED") throw new Error("Super Admin can't be assigned to a pending invitation.");
    const kept = normalizeExtras(m.extraPermissions, to.permissions);
    const dropped = countPermissions(subtractPermissions(m.extraPermissions, kept));
    next = { ...next, roleId: to.id, extraPermissions: kept };
    events.push(event("ROLE_CHANGED", m.id, displayName(m), `${roleName(d, m.roleId)} → ${to.name}${dropped ? ` · ${plural(dropped, "extra permission")} now included in the role` : ""}`));
  }
  if (patch.status && patch.status !== m.status) {
    if (m.isOwner) throw new Error("The workspace owner can't be suspended.");
    if (m.status === "INVITED") throw new Error("Pending invitations can't be suspended — revoke the invite instead.");
    next = { ...next, status: patch.status };
    events.push(event(patch.status === "SUSPENDED" ? "SUSPENDED" : "REACTIVATED", m.id, displayName(m), patch.reason?.trim() || (patch.status === "SUSPENDED" ? "Access paused" : "Access restored")));
  }
  if (!events.length) return m;
  write(withEvents({ ...d, members: d.members.map((x) => (x.id === id ? next : x)) }, ...events));
  return next;
}

export async function removeMember(id: string) {
  await wait();
  const d = read();
  const m = getMember(d, id);
  if (m.isOwner) throw new Error("The workspace owner can't be removed.");
  write(withEvents({ ...d, members: d.members.filter((x) => x.id !== id) }, event(m.status === "INVITED" ? "INVITE_REVOKED" : "REMOVED", null, displayName(m), `Was ${roleName(d, m.roleId)}`)));
}

/**
 * Replaces a member's extra permissions (grants on top of their role). Pruned against the role so extras
 * never repeat role permissions; View is added where the role has none. Logs granted / removed events.
 */
export async function setMemberExtraPermissions(id: string, extraPermissions: Partial<RolePermissions>): Promise<TeamMember> {
  await wait(550);
  const d = read();
  const m = getMember(d, id);
  if (m.isOwner) throw new Error("The workspace owner already has every permission.");
  const role = getRole(d, m.roleId);
  if (role.isLocked) throw new Error(`${role.name} already has every permission.`);
  const next = normalizeExtras(extraPermissions, role.permissions);
  if (samePermissions(next, m.extraPermissions)) return m;
  const added = subtractPermissions(next, m.extraPermissions);
  const removed = subtractPermissions(m.extraPermissions, next);
  const events: TeamEvent[] = [];
  if (countPermissions(removed)) events.push(event("EXTRA_PERMISSIONS_REMOVED", m.id, displayName(m), countPermissions(next) === 0 ? `All extras removed (${listGrants(removed)})` : listGrants(removed)));
  if (countPermissions(added)) events.push(event("EXTRA_PERMISSIONS_GRANTED", m.id, displayName(m), listGrants(added)));
  const updated: TeamMember = { ...m, extraPermissions: next };
  write(withEvents({ ...d, members: d.members.map((x) => (x.id === id ? updated : x)) }, ...events));
  return updated;
}

/** Mock: turns 2FA off so the member must enrol again at next sign-in. */
export async function resetTwoFactor(id: string): Promise<TeamMember> {
  await wait(600);
  const d = read();
  const m = getMember(d, id);
  if (m.status === "INVITED") throw new Error("This person hasn't joined yet.");
  if (!m.twoFactorEnabled) throw new Error(`${displayName(m)} doesn't have two-factor authentication set up.`);
  const next = { ...m, twoFactorEnabled: false };
  write(withEvents({ ...d, members: d.members.map((x) => (x.id === id ? next : x)) }, event("TWO_FA_RESET", m.id, displayName(m), "Must set up 2FA again at next sign-in")));
  return next;
}

/** Mock reminder e-mail to members without 2FA. Returns how many were reminded. */
export async function remindTwoFactor(ids: string[]): Promise<number> {
  await wait(700);
  return ids.length;
}

// ---------------------------------------------------------------- roles
const assertUniqueName = (d: TeamSeed, name: string, selfId?: string) => {
  if (d.roles.some((r) => r.id !== selfId && r.name.trim().toLowerCase() === name.trim().toLowerCase())) throw new Error(`A role named "${name.trim()}" already exists.`);
};

const scope = (r: Pick<TeamRole, "permissions">) => `${modulesWithAccess(r.permissions).length} modules · ${countPermissions(r.permissions)} permissions`;

/** "Added Courses → Delete, removed Settings → View" (first few changes). */
function diffPermissions(before: TeamRole["permissions"], after: TeamRole["permissions"]) {
  const added: string[] = [];
  const removed: string[] = [];
  TEAM_MODULES.forEach((m) => {
    after[m].filter((a) => !before[m].includes(a)).forEach((a) => added.push(`${MODULE_LABEL[m]} → ${ACTION_LABEL[a]}`));
    before[m].filter((a) => !after[m].includes(a)).forEach((a) => removed.push(`${MODULE_LABEL[m]} → ${ACTION_LABEL[a]}`));
  });
  const fmt = (verb: string, xs: string[]) => (xs.length ? `${verb} ${xs.slice(0, 2).join(", ")}${xs.length > 2 ? ` +${xs.length - 2}` : ""}` : "");
  const out = [fmt("Added", added), fmt("removed", removed)].filter(Boolean).join(", ");
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export async function createRole(v: RoleFormValues): Promise<TeamRole> {
  await wait(650);
  const d = read();
  assertUniqueName(d, v.name);
  const now = new Date().toISOString();
  const r: TeamRole = { id: uid("role"), name: v.name.trim(), description: v.description.trim(), tone: v.tone, isSystem: false, isLocked: false, permissions: normalizePermissions(v.permissions), defaultPermissions: null, createdAt: now, updatedAt: now };
  write(withEvents({ ...d, roles: [...d.roles, r] }, event("ROLE_CREATED", r.id, r.name, scope(r))));
  return r;
}

/** Re-prunes extras of everyone holding `role` after its permissions change (keeps extras ∩ role = ∅). */
const repruneHolders = (members: TeamMember[], role: TeamRole) =>
  members.map((m) => (m.roleId === role.id ? { ...m, extraPermissions: role.isLocked ? emptyPermissions() : normalizeExtras(m.extraPermissions, role.permissions) } : m));

/**
 * Custom roles: everything editable. System roles: description, colour and permissions are editable,
 * the name is fixed. Super Admin (locked) can't be edited at all.
 */
export async function updateRole(id: string, v: RoleFormValues): Promise<TeamRole> {
  await wait(650);
  const d = read();
  const cur = getRole(d, id);
  if (cur.isLocked) throw new Error(`${cur.name} always has every permission and can't be edited.`);
  if (cur.isSystem && v.name.trim() !== cur.name) throw new Error(`System role names can't be changed. ${cur.name} keeps its name.`);
  assertUniqueName(d, v.name, id);
  const next: TeamRole = { ...cur, name: cur.isSystem ? cur.name : v.name.trim(), description: v.description.trim(), tone: v.tone, permissions: normalizePermissions(v.permissions), updatedAt: new Date().toISOString() };
  const changes = [cur.name !== next.name ? `Renamed from ${cur.name}` : "", diffPermissions(cur.permissions, next.permissions)].filter(Boolean).join(" · ");
  write(withEvents({ ...d, roles: d.roles.map((r) => (r.id === id ? next : r)), members: repruneHolders(d.members, next) }, event("ROLE_UPDATED", id, next.name, changes || "Details updated")));
  return next;
}

/** System roles: restores the shipped preset permissions (name, description and colour are kept). */
export async function resetRoleToDefault(id: string): Promise<TeamRole> {
  await wait(600);
  const d = read();
  const cur = getRole(d, id);
  if (cur.isLocked) throw new Error(`${cur.name} always has every permission.`);
  if (!cur.isSystem || !cur.defaultPermissions) throw new Error("Only built-in roles have default permissions.");
  if (!isRoleModified(cur)) throw new Error(`${cur.name} already uses its default permissions.`);
  const next: TeamRole = { ...cur, permissions: normalizePermissions(structuredClone(cur.defaultPermissions)), updatedAt: new Date().toISOString() };
  write(withEvents({ ...d, roles: d.roles.map((r) => (r.id === id ? next : r)), members: repruneHolders(d.members, next) }, event("ROLE_RESET", id, next.name, diffPermissions(cur.permissions, next.permissions) || "Default permissions restored")));
  return next;
}

export async function deleteRole(id: string) {
  await wait();
  const d = read();
  const r = getRole(d, id);
  if (r.isSystem) throw new Error("System roles can't be deleted.");
  const assigned = d.members.filter((m) => m.roleId === id).length;
  if (assigned > 0) throw new Error(`${assigned} ${assigned === 1 ? "person still has" : "people still have"} this role. Move them to another role first.`);
  write(withEvents({ ...d, roles: d.roles.filter((x) => x.id !== id) }, event("ROLE_DELETED", null, r.name, "Custom role removed")));
}

export async function duplicateRole(id: string): Promise<TeamRole> {
  await wait();
  const d = read();
  const src = getRole(d, id);
  let name = `${src.name} (Copy)`.slice(0, 40);
  for (let i = 2; d.roles.some((r) => r.name.toLowerCase() === name.toLowerCase()); i++) name = `${src.name} (Copy ${i})`.slice(0, 40);
  const now = new Date().toISOString();
  const copy: TeamRole = { ...structuredClone(src), id: uid("role"), name, isSystem: false, isLocked: false, defaultPermissions: null, tone: src.tone, createdAt: now, updatedAt: now };
  write(withEvents({ ...d, roles: [...d.roles, copy] }, event("ROLE_CREATED", copy.id, copy.name, `Duplicated from ${src.name}`)));
  return copy;
}
