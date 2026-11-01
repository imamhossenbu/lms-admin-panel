import type { PermissionAction, RolePermissions, RoleTone, TeamEvent, TeamEventType, TeamMember, TeamModule, TeamRole, TeamSeed } from "@/types/team";
import { countPermissions, emptyPermissions, fullPermissions, listGrants, mergePermissions, modulesWithAccess, normalizeExtras, normalizePermissions } from "@/lib/teamPermissions";

/**
 * Deterministic mock data for Team & Roles (mock-first), relative to "now".
 * 13 admin-panel staff: the owner (Imam Hossain, Super Admin), admins, content, support, finance and
 * custom Marketing / Teaching Assistant roles; 3 invitations (2 pending, 1 expired) and one suspended member.
 * System roles keep their shipped preset in `defaultPermissions`; Support has been modified (Orders → Export,
 * Quizzes → View added). Rafiq (Content Manager +3) and Sadia (Support +1) hold extra permissions, and Lamia's
 * pending Support invitation carries one extra.
 * Counts on the page (pending invites, 2FA coverage, members per role) are DERIVED in src/lib/teamStats.ts.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const OWNER_ID = "member-imam";
export const OWNER_NAME = "Imam Hossain";
export const SUPER_ADMIN_ROLE_ID = "role-super-admin";

const MIN = 60000;
const H = 60 * MIN;
const D = 24 * H;

type Grants = Partial<Record<TeamModule, PermissionAction[]>>;
const ALL: Record<string, PermissionAction[]> = {
  crud: ["view", "manage", "delete"],
};

const role = (
  id: string,
  name: string,
  description: string,
  tone: RoleTone,
  permissions: RolePermissions,
  opts: { system: boolean; locked?: boolean; ageDays: number; editedDays: number; /** System roles: current permissions when they differ from the preset. */ current?: RolePermissions },
  now: number
): TeamRole => ({
  id,
  name,
  description,
  tone,
  isSystem: opts.system,
  isLocked: !!opts.locked,
  permissions: opts.current ?? permissions,
  defaultPermissions: opts.system ? permissions : null,
  createdAt: new Date(now - opts.ageDays * D).toISOString(),
  updatedAt: new Date(now - opts.editedDays * D).toISOString(),
});

/** Owner's edits to the Support preset. */
const SUPPORT_CHANGES: Grants = { orders: ["export"], quizzes: ["view"] };
const SUPPORT_EDITED_DAYS = 9;

function buildRoles(now: number): TeamRole[] {
  const admin = fullPermissions();
  admin.team = ["view"];
  admin.settings = ["view"];

  const content: Grants = {
    dashboard: ["view"],
    analytics: ["view"],
    courses: ALL.crud,
    categories: ALL.crud,
    instructors: ["view"],
    liveClasses: ALL.crud,
    assignments: ALL.crud,
    quizzes: ALL.crud,
    community: ["view", "manage", "moderate"],
    certificates: ["view", "manage"],
    notifications: ["view", "manage"],
  };
  const support: Grants = {
    dashboard: ["view"],
    students: ["view", "manage"],
    instructors: ["view"],
    orders: ["view"],
    payments: ["view"],
    liveClasses: ["view"],
    community: ["view", "manage", "moderate"],
    certificates: ["view", "manage"],
    notifications: ["view", "manage"],
  };
  const finance: Grants = {
    dashboard: ["view"],
    analytics: ["view", "export"],
    students: ["view"],
    orders: ["view", "manage", "export"],
    payments: ["view", "manage", "export", "refund"],
  };
  const marketing: Grants = {
    dashboard: ["view"],
    analytics: ["view", "export"],
    courses: ["view"],
    categories: ["view"],
    students: ["view"],
    notifications: ["view", "manage"],
    community: ["view"],
  };
  const ta: Grants = {
    dashboard: ["view"],
    courses: ["view"],
    assignments: ["view", "manage"],
    quizzes: ["view", "manage"],
    liveClasses: ["view"],
    community: ["view", "manage"],
  };

  // Support was adjusted by the owner 9 days ago (see the ROLE_UPDATED event).
  const supportPreset = normalizePermissions(support);
  const supportNow = mergePermissions(supportPreset, SUPPORT_CHANGES);

  return [
    role(SUPER_ADMIN_ROLE_ID, "Super Admin", "Full, unrestricted access to everything, including billing, settings and the team.", "orange", fullPermissions(), { system: true, locked: true, ageDays: 720, editedDays: 720 }, now),
    role("role-admin", "Admin", "Runs day-to-day operations across every area. Can't manage the team or change platform settings.", "blue", admin, { system: true, ageDays: 720, editedDays: 720 }, now),
    role("role-content", "Content Manager", "Builds and maintains courses, lessons, quizzes and assignments, and moderates discussions.", "purple", normalizePermissions(content), { system: true, ageDays: 720, editedDays: 720 }, now),
    role("role-support", "Support", "Helps learners: student accounts, orders lookup, community replies and certificates.", "green", supportPreset, { system: true, ageDays: 720, editedDays: SUPPORT_EDITED_DAYS, current: supportNow }, now),
    role("role-finance", "Finance", "Handles orders, payments, refunds and revenue exports.", "yellow", normalizePermissions(finance), { system: true, ageDays: 720, editedDays: 720 }, now),
    role("role-marketing", "Marketing", "Sends broadcasts and reads analytics to plan campaigns. Read-only on the catalogue.", "red", normalizePermissions(marketing), { system: false, ageDays: 140, editedDays: 12 }, now),
    role("role-ta", "Teaching Assistant", "Grades assignments and quizzes and answers course questions.", "gray", normalizePermissions(ta), { system: false, ageDays: 60, editedDays: 20 }, now),
  ];
}


/** Extra permissions on top of the role (normalised against the role in buildTeamSeed). */
const EXTRAS: Record<string, { grants: Grants; daysAgo: number }> = {
  rafiq: { grants: { analytics: ["export"], students: ["view"], orders: ["view"] }, daysAgo: 15 },
  sadia: { grants: { payments: ["refund"] }, daysAgo: 6 },
  lamia: { grants: { courses: ["view"] }, daysAgo: 0 },
};

interface MemberSpec {
  key: string;
  name: string;
  email: string;
  roleId: string;
  status: "ACTIVE" | "SUSPENDED";
  twoFa: boolean;
  joinedDaysAgo: number;
  lastActiveMin: number;
  location: string;
}

const MEMBERS: MemberSpec[] = [
  { key: "imam", name: OWNER_NAME, email: "imam.hossain@edupro.com", roleId: SUPER_ADMIN_ROLE_ID, status: "ACTIVE", twoFa: true, joinedDaysAgo: 715, lastActiveMin: 2, location: "Dhaka, BD" },
  { key: "farhana", name: "Farhana Akter", email: "farhana.akter@edupro.com", roleId: "role-admin", status: "ACTIVE", twoFa: true, joinedDaysAgo: 540, lastActiveMin: 35, location: "Dhaka, BD" },
  { key: "tanvir", name: "Tanvir Ahmed", email: "tanvir.ahmed@edupro.com", roleId: "role-admin", status: "ACTIVE", twoFa: false, joinedDaysAgo: 310, lastActiveMin: 5 * 60, location: "Chattogram, BD" },
  { key: "nusrat", name: "Nusrat Jahan", email: "nusrat.jahan@edupro.com", roleId: "role-content", status: "ACTIVE", twoFa: true, joinedDaysAgo: 420, lastActiveMin: 12, location: "Dhaka, BD" },
  { key: "rafiq", name: "Rafiq Islam", email: "rafiq.islam@edupro.com", roleId: "role-content", status: "ACTIVE", twoFa: false, joinedDaysAgo: 180, lastActiveMin: 26 * 60, location: "Sylhet, BD" },
  { key: "jahid", name: "Jahid Hasan", email: "jahid.hasan@edupro.com", roleId: "role-content", status: "ACTIVE", twoFa: true, joinedDaysAgo: 95, lastActiveMin: 3 * 24 * 60, location: "Khulna, BD" },
  { key: "sadia", name: "Sadia Chowdhury", email: "sadia.chowdhury@edupro.com", roleId: "role-support", status: "ACTIVE", twoFa: true, joinedDaysAgo: 260, lastActiveMin: 48, location: "Dhaka, BD" },
  { key: "mehedi", name: "Mehedi Hasan", email: "mehedi.hasan@edupro.com", roleId: "role-support", status: "SUSPENDED", twoFa: false, joinedDaysAgo: 230, lastActiveMin: 19 * 24 * 60, location: "Rajshahi, BD" },
  { key: "shirin", name: "Shirin Sultana", email: "shirin.sultana@edupro.com", roleId: "role-finance", status: "ACTIVE", twoFa: true, joinedDaysAgo: 365, lastActiveMin: 7 * 60, location: "Dhaka, BD" },
  { key: "arif", name: "Arif Rahman", email: "arif.rahman@edupro.com", roleId: "role-marketing", status: "ACTIVE", twoFa: false, joinedDaysAgo: 120, lastActiveMin: 2 * 24 * 60, location: "Dhaka, BD" },
];

const INVITES: { key: string; email: string; roleId: string; sentDaysAgo: number; expired: boolean; message: string; resent: number }[] = [
  { key: "lamia", email: "lamia.khan@edupro.com", roleId: "role-support", sentDaysAgo: 2, expired: false, message: "Welcome aboard! You'll be helping our learners on the support desk.", resent: 0 },
  { key: "kabir", email: "kabir.dev@edupro.com", roleId: "role-ta", sentDaysAgo: 6, expired: false, message: "", resent: 1 },
  { key: "rina", email: "rina.accounts@gmail.com", roleId: "role-finance", sentDaysAgo: 11, expired: true, message: "Invitation to help with month-end payouts.", resent: 0 },
];

export function buildTeamSeed(now: Date = new Date()): TeamSeed {
  const t = now.getTime();
  const rand = mulberry32(20261101);
  const roles = buildRoles(t);
  const iso = (msAgo: number) => new Date(t - Math.max(0, msAgo)).toISOString();

  const extrasFor = (key: string, roleId: string) => normalizeExtras(EXTRAS[key]?.grants, roles.find((r) => r.id === roleId)!.permissions);

  const members: TeamMember[] = MEMBERS.map((m) => ({
    id: `member-${m.key}`,
    name: m.name,
    email: m.email,
    roleId: m.roleId,
    extraPermissions: m.key === "imam" ? emptyPermissions() : extrasFor(m.key, m.roleId),
    status: m.status,
    isOwner: m.key === "imam",
    twoFactorEnabled: m.twoFa,
    lastActiveAt: iso(m.lastActiveMin * MIN + Math.floor(rand() * 50) * 1000),
    lastLoginIp: `103.${120 + Math.floor(rand() * 60)}.${Math.floor(rand() * 250)}.${10 + Math.floor(rand() * 240)}`,
    location: m.location,
    joinedAt: iso(m.joinedDaysAgo * D + Math.floor(rand() * 8) * H),
    invite: null,
  }));

  const invited: TeamMember[] = INVITES.map((inv) => {
    const sentAt = t - inv.sentDaysAgo * D - Math.floor(rand() * 5) * H;
    return {
      id: `member-${inv.key}`,
      name: "",
      email: inv.email,
      roleId: inv.roleId,
      extraPermissions: extrasFor(inv.key, inv.roleId),
      status: "INVITED",
      isOwner: false,
      twoFactorEnabled: false,
      lastActiveAt: null,
      lastLoginIp: "",
      location: "",
      joinedAt: null,
      invite: {
        status: inv.expired ? "EXPIRED" : "PENDING",
        sentAt: new Date(sentAt).toISOString(),
        expiresAt: new Date(sentAt + 7 * D).toISOString(),
        message: inv.message,
        invitedBy: OWNER_NAME,
        resentCount: inv.resent,
      },
    };
  });

  // ---- activity log (newest first)
  let n = 0;
  const ev = (type: TeamEventType, targetId: string | null, targetName: string, detail: string, msAgo: number, actor = OWNER_NAME): TeamEvent => ({
    id: `team-ev-${++n}`,
    type,
    actor,
    targetId,
    targetName,
    detail,
    at: iso(msAgo),
  });
  const byKey = (k: string) => [...members, ...invited].find((m) => m.id === `member-${k}`)!;
  const invAt = (k: string) => t - Date.parse(byKey(k).invite!.sentAt);
  const scope = (id: string) => {
    const p = roles.find((r) => r.id === id)!.permissions;
    return `${modulesWithAccess(p).length} modules · ${countPermissions(p)} permissions`;
  };

  const extrasDetail = (k: string) => listGrants(byKey(k).extraPermissions);
  const extraN = (k: string) => {
    const n = countPermissions(byKey(k).extraPermissions);
    return n ? ` + ${n} extra permission${n === 1 ? "" : "s"}` : "";
  };

  const events: TeamEvent[] = [
    ev("TWO_FA_ENABLED", "member-jahid", "Jahid Hasan", "Authenticator app", 3 * H + 20 * MIN, "Jahid Hasan"),
    ev("INVITED", "member-lamia", "lamia.khan@edupro.com", `as Support${extraN("lamia")}`, invAt("lamia")),
    ev("EXTRA_PERMISSIONS_GRANTED", "member-sadia", "Sadia Chowdhury", extrasDetail("sadia"), EXTRAS.sadia.daysAgo * D + 3 * H),
    ev("ROLE_UPDATED", "role-support", "Support", "Added Orders → Export, Quizzes → View", SUPPORT_EDITED_DAYS * D),
    ev("EXTRA_PERMISSIONS_GRANTED", "member-rafiq", "Rafiq Islam", extrasDetail("rafiq"), EXTRAS.rafiq.daysAgo * D + 5 * H),
    ev("INVITE_RESENT", "member-kabir", "kabir.dev@edupro.com", "Reminder sent", 3 * D + 2 * H),
    ev("ROLE_UPDATED", "role-marketing", "Marketing", "Added Analytics → Export", 12 * D),
    ev("INVITED", "member-kabir", "kabir.dev@edupro.com", "as Teaching Assistant", invAt("kabir")),
    ev("INVITED", "member-rina", "rina.accounts@gmail.com", "as Finance", invAt("rina")),
    ev("SUSPENDED", "member-mehedi", "Mehedi Hasan", "Repeated failed sign-ins from a new device", 18 * D + 4 * H),
    ev("ROLE_CHANGED", "member-tanvir", "Tanvir Ahmed", "Content Manager → Admin", 21 * D),
    ev("ROLE_UPDATED", "role-ta", "Teaching Assistant", "Added Community → Create & edit", 20 * D),
    ev("TWO_FA_RESET", "member-rafiq", "Rafiq Islam", "Lost phone — must set up 2FA again", 26 * D),
    ev("ROLE_CREATED", "role-ta", "Teaching Assistant", scope("role-ta"), 60 * D),
    ev("JOINED", "member-jahid", "Jahid Hasan", "as Content Manager", 95 * D, "Jahid Hasan"),
    ev("JOINED", "member-arif", "Arif Rahman", "as Marketing", 120 * D, "Arif Rahman"),
    ev("ROLE_CREATED", "role-marketing", "Marketing", scope("role-marketing"), 140 * D),
    ev("JOINED", "member-rafiq", "Rafiq Islam", "as Content Manager", 180 * D, "Rafiq Islam"),
    ev("REMOVED", null, "Kamal Uddin", "Left the company", 200 * D),
  ];

  return { members: [...members, ...invited], roles, events: events.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)) };
}

export default buildTeamSeed;
