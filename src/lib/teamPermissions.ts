import { PERMISSION_ACTIONS, TEAM_MODULES, type PermissionAction, type RolePermissions, type TeamModule } from "@/types/team";

/**
 * Permission model for Team & Roles: which actions apply to which module, plus pure helpers
 * (normalise, count, summarise) shared by the seed, the schemas, the storage and the UI.
 */

export const MODULE_LABEL: Record<TeamModule, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  courses: "Courses",
  categories: "Categories",
  students: "Students",
  instructors: "Instructors",
  orders: "Orders",
  payments: "Payments",
  liveClasses: "Live Classes",
  assignments: "Assignments",
  quizzes: "Quizzes",
  community: "Community",
  certificates: "Certificates",
  notifications: "Notifications",
  settings: "Settings",
  team: "Team",
};

export const MODULE_HINT: Record<TeamModule, string> = {
  dashboard: "Overview and KPIs",
  analytics: "Reports and exports",
  courses: "Courses, lessons, pricing",
  categories: "Course categories",
  students: "Learners and enrollments",
  instructors: "Instructor profiles",
  orders: "Orders and invoices",
  payments: "Transactions and refunds",
  liveClasses: "Sessions and recordings",
  assignments: "Assignments and grading",
  quizzes: "Quizzes and results",
  community: "Discussions and reports",
  certificates: "Templates and issuing",
  notifications: "Broadcasts and templates",
  settings: "Platform configuration",
  team: "Admins, roles and invites",
};

export const ACTION_LABEL: Record<PermissionAction, string> = {
  view: "View",
  manage: "Create & edit",
  delete: "Delete",
  export: "Export",
  refund: "Refund",
  moderate: "Moderate",
};

/** Actions that exist for each module (anything else renders as N/A). */
export const MODULE_ACTIONS: Record<TeamModule, PermissionAction[]> = {
  dashboard: ["view"],
  analytics: ["view", "export"],
  courses: ["view", "manage", "delete"],
  categories: ["view", "manage", "delete"],
  students: ["view", "manage", "delete"],
  instructors: ["view", "manage", "delete"],
  orders: ["view", "manage", "delete", "export"],
  payments: ["view", "manage", "export", "refund"],
  liveClasses: ["view", "manage", "delete"],
  assignments: ["view", "manage", "delete"],
  quizzes: ["view", "manage", "delete"],
  community: ["view", "manage", "delete", "moderate"],
  certificates: ["view", "manage", "delete"],
  notifications: ["view", "manage", "delete"],
  settings: ["view", "manage"],
  team: ["view", "manage", "delete"],
};

/** Grants that deserve a warning in the editor. */
export const SENSITIVE_GRANTS: { module: TeamModule; action: PermissionAction; label: string }[] = [
  { module: "team", action: "manage", label: "invite admins and change roles" },
  { module: "settings", action: "manage", label: "change platform settings" },
  { module: "payments", action: "refund", label: "issue refunds" },
  { module: "students", action: "delete", label: "delete student accounts" },
];

export const isApplicable = (module: TeamModule, action: PermissionAction) => MODULE_ACTIONS[module].includes(action);

export const emptyPermissions = (): RolePermissions =>
  Object.fromEntries(TEAM_MODULES.map((m) => [m, [] as PermissionAction[]])) as unknown as RolePermissions;

export const fullPermissions = (): RolePermissions =>
  Object.fromEntries(TEAM_MODULES.map((m) => [m, [...MODULE_ACTIONS[m]]])) as unknown as RolePermissions;

/** Keeps only applicable actions in canonical order and adds "view" whenever another action is on. */
export function normalizeRow(module: TeamModule, actions: PermissionAction[]): PermissionAction[] {
  const set = new Set(actions.filter((a) => isApplicable(module, a)));
  if (set.size > 0) set.add("view");
  return PERMISSION_ACTIONS.filter((a) => set.has(a));
}

export function normalizePermissions(p: Partial<RolePermissions>): RolePermissions {
  return Object.fromEntries(TEAM_MODULES.map((m) => [m, normalizeRow(m, p[m] ?? [])])) as unknown as RolePermissions;
}

/** Toggle one cell. Turning "view" off clears the row (nothing else works without it). */
export function toggleCell(p: RolePermissions, module: TeamModule, action: PermissionAction, on: boolean): RolePermissions {
  if (!isApplicable(module, action)) return p;
  const row = p[module];
  const next = action === "view" && !on ? [] : on ? [...row, action] : row.filter((a) => a !== action);
  return { ...p, [module]: normalizeRow(module, next) };
}

export const setRow = (p: RolePermissions, module: TeamModule, on: boolean): RolePermissions => ({
  ...p,
  [module]: on ? [...MODULE_ACTIONS[module]] : [],
});

/** Column toggle across every module where the action applies. */
export function setColumn(p: RolePermissions, action: PermissionAction, on: boolean): RolePermissions {
  return TEAM_MODULES.reduce((acc, m) => (isApplicable(m, action) ? toggleCell(acc, m, action, on) : acc), p);
}

export type ToggleState = "on" | "off" | "mixed";

export function rowState(p: RolePermissions, module: TeamModule): ToggleState {
  const n = p[module].length;
  return n === 0 ? "off" : n === MODULE_ACTIONS[module].length ? "on" : "mixed";
}

export function columnState(p: RolePermissions, action: PermissionAction): ToggleState {
  const mods = TEAM_MODULES.filter((m) => isApplicable(m, action));
  const on = mods.filter((m) => p[m].includes(action)).length;
  return on === 0 ? "off" : on === mods.length ? "on" : "mixed";
}

export const TOTAL_PERMISSIONS = TEAM_MODULES.reduce((n, m) => n + MODULE_ACTIONS[m].length, 0);
export const countPermissions = (p: RolePermissions) => TEAM_MODULES.reduce((n, m) => n + p[m].length, 0);
export const modulesWithAccess = (p: RolePermissions) => TEAM_MODULES.filter((m) => p[m].length > 0);

export interface PermissionSummary {
  full: TeamModule[];
  edit: TeamModule[];
  viewOnly: TeamModule[];
  none: TeamModule[];
  sensitive: string[];
  granted: number;
}

/** Buckets modules for the live summary ("Full access", "Can edit", "View only", "No access"). */
export function summarizePermissions(p: RolePermissions): PermissionSummary {
  const s: PermissionSummary = { full: [], edit: [], viewOnly: [], none: [], sensitive: [], granted: countPermissions(p) };
  TEAM_MODULES.forEach((m) => {
    const row = p[m];
    if (row.length === 0) s.none.push(m);
    else if (row.length === MODULE_ACTIONS[m].length && row.length > 1) s.full.push(m);
    else if (row.length === 1) s.viewOnly.push(m);
    else s.edit.push(m);
  });
  s.sensitive = SENSITIVE_GRANTS.filter((g) => p[g.module].includes(g.action)).map((g) => g.label);
  return s;
}

const list = (mods: TeamModule[], max = 4) => {
  const names = mods.map((m) => MODULE_LABEL[m].toLowerCase());
  if (names.length <= max) return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : (names[0] ?? "");
  return `${names.slice(0, max).join(", ")} +${names.length - max} more`;
};

/** One-line plain-English description, e.g. "Can manage courses, quizzes… View only: students. No access to settings." */
export function describePermissions(p: RolePermissions): string {
  const s = summarizePermissions(p);
  if (s.granted === 0) return "No access yet — turn on at least one permission.";
  if (s.none.length === 0 && s.edit.length === 0 && s.viewOnly.filter((m) => MODULE_ACTIONS[m].length > 1).length === 0) return "Full access to every area of the admin panel.";
  const parts: string[] = [];
  const manage = [...s.full, ...s.edit];
  if (manage.length) parts.push(`Can manage ${list(manage)}.`);
  if (s.viewOnly.length) parts.push(`View only: ${list(s.viewOnly, 3)}.`);
  if (s.none.length) parts.push(`No access to ${list(s.none, 3)}.`);
  return parts.join(" ");
}

export const samePermissions = (a: RolePermissions, b: RolePermissions) =>
  TEAM_MODULES.every((m) => a[m].length === b[m].length && a[m].every((x) => b[m].includes(x)));
