/**
 * Team & Roles (admin-panel staff only — students and instructors live on their own pages).
 * Mock-first: persisted by src/lib/teamStorage.ts, seeded by src/data/mockTeamData.ts.
 */

export const TEAM_MODULES = [
  "dashboard",
  "analytics",
  "courses",
  "categories",
  "students",
  "instructors",
  "orders",
  "payments",
  "liveClasses",
  "assignments",
  "quizzes",
  "community",
  "certificates",
  "notifications",
  "settings",
  "team",
] as const;
export type TeamModule = (typeof TEAM_MODULES)[number];

/** "manage" = Create & edit. Export / Refund / Moderate only exist on some modules. */
export const PERMISSION_ACTIONS = ["view", "manage", "delete", "export", "refund", "moderate"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

/** Granted actions per module (every module key is always present; [] = no access). */
export type RolePermissions = Record<TeamModule, PermissionAction[]>;

export const ROLE_TONES = ["orange", "blue", "green", "purple", "yellow", "red", "gray"] as const;
export type RoleTone = (typeof ROLE_TONES)[number];

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  tone: RoleTone;
  /** Built-in role: can't be renamed or deleted, but the Super Admin can change its permissions (and reset them). */
  isSystem: boolean;
  /** Super Admin: always every permission, never editable. */
  isLocked: boolean;
  /** Current permissions (what people with this role can do right now). */
  permissions: RolePermissions;
  /** System roles: the shipped preset ("Reset to default" restores it). null for custom roles. */
  defaultPermissions: RolePermissions | null;
  createdAt: string;
  updatedAt: string;
}

export type MemberStatus = "ACTIVE" | "INVITED" | "SUSPENDED";
export type InviteStatus = "PENDING" | "EXPIRED";

/** Present only while status = INVITED. */
export interface MemberInvite {
  status: InviteStatus;
  sentAt: string;
  expiresAt: string;
  message: string;
  invitedBy: string;
  resentCount: number;
}

export interface TeamMember {
  id: string;
  /** Empty for invitations that haven't been accepted yet. */
  name: string;
  email: string;
  roleId: string;
  /**
   * Grants on top of the role (additive only). Never repeats an action the role already gives;
   * holds "view" only when the role has no View on that module. Always empty for the owner / Super Admin.
   */
  extraPermissions: RolePermissions;
  status: MemberStatus;
  /** Workspace owner: can't be removed, suspended or moved off Super Admin. */
  isOwner: boolean;
  twoFactorEnabled: boolean;
  lastActiveAt: string | null;
  lastLoginIp: string;
  location: string;
  joinedAt: string | null;
  invite: MemberInvite | null;
}

export type TeamEventType =
  | "INVITED"
  | "INVITE_RESENT"
  | "INVITE_REVOKED"
  | "JOINED"
  | "ROLE_CHANGED"
  | "SUSPENDED"
  | "REACTIVATED"
  | "REMOVED"
  | "TWO_FA_ENABLED"
  | "TWO_FA_RESET"
  | "ROLE_CREATED"
  | "ROLE_UPDATED"
  | "ROLE_RESET"
  | "ROLE_DELETED"
  | "EXTRA_PERMISSIONS_GRANTED"
  | "EXTRA_PERMISSIONS_REMOVED";

export interface TeamEvent {
  id: string;
  type: TeamEventType;
  actor: string;
  /** Member or role the event is about. */
  targetId: string | null;
  targetName: string;
  /** Short human detail, e.g. "Support → Content Manager". */
  detail: string;
  at: string;
}

export interface TeamSeed {
  members: TeamMember[];
  roles: TeamRole[];
  events: TeamEvent[];
}
