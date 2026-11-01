import { z } from "zod";
import { PERMISSION_ACTIONS, ROLE_TONES, TEAM_MODULES, type RolePermissions } from "@/types/team";
import { MODULE_ACTIONS, MODULE_LABEL, ACTION_LABEL, countPermissions } from "@/lib/teamPermissions";

export const ROLE_NAME_MAX = 40;
export const ROLE_DESCRIPTION_MAX = 160;
export const INVITE_MESSAGE_MAX = 300;
export const INVITE_MAX_EMAILS = 10;
export const INVITE_EXPIRY_DAYS = 7;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (v: string) => EMAIL_RE.test(v) && v.length <= 254;

const actionSchema = z.enum(PERMISSION_ACTIONS);
const moduleSchema = z.enum(TEAM_MODULES);

/**
 * Every module present; only applicable actions; "View" required whenever any other action in the row is on.
 */
export const permissionsSchema = z.record(moduleSchema, z.array(actionSchema)).superRefine((p, ctx) => {
  TEAM_MODULES.forEach((m) => {
    const row = p[m] ?? [];
    const bad = row.find((a) => !MODULE_ACTIONS[m].includes(a));
    if (bad) ctx.addIssue({ code: "custom", path: [m], message: `${ACTION_LABEL[bad]} doesn't apply to ${MODULE_LABEL[m]}` });
    if (row.length > 0 && !row.includes("view")) ctx.addIssue({ code: "custom", path: [m], message: `${MODULE_LABEL[m]} needs View when other actions are on` });
    if (new Set(row).size !== row.length) ctx.addIssue({ code: "custom", path: [m], message: `Duplicate actions on ${MODULE_LABEL[m]}` });
  });
});

/** Role editor (/users/roles/new, /users/roles/[id]/edit). `takenNames` = other roles' names (lower-case). */
export const roleFormSchema = (takenNames: string[] = []) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Role name must be at least 2 characters")
        .max(ROLE_NAME_MAX, `${ROLE_NAME_MAX} characters or less`)
        .regex(/^[\p{L}\p{N} &'()\-/.]+$/u, "Use letters, numbers, spaces and & ' ( ) - / . only"),
      description: z.string().trim().max(ROLE_DESCRIPTION_MAX, `${ROLE_DESCRIPTION_MAX} characters or less`),
      tone: z.enum(ROLE_TONES),
      permissions: permissionsSchema,
    })
    .superRefine((v, ctx) => {
      if (takenNames.includes(v.name.trim().toLowerCase())) ctx.addIssue({ code: "custom", path: ["name"], message: "Another role already uses this name" });
      if (countPermissions(v.permissions as RolePermissions) === 0) ctx.addIssue({ code: "custom", path: ["permissions"], message: "Turn on at least one permission" });
    });
export type RoleFormValues = z.infer<ReturnType<typeof roleFormSchema>> & { permissions: RolePermissions };

/** Invite modal. `memberEmails` = emails already on the team (members + pending invites), lower-case. */
export const inviteFormSchema = (memberEmails: string[] = [], assignableRoleIds: string[] = []) =>
  z
    .object({
      emails: z.array(z.string()).min(1, "Add at least one email address").max(INVITE_MAX_EMAILS, `Invite up to ${INVITE_MAX_EMAILS} people at a time`),
      roleId: z.string().min(1, "Choose a role"),
      message: z.string().trim().max(INVITE_MESSAGE_MAX, `${INVITE_MESSAGE_MAX} characters or less`),
    })
    .superRefine((v, ctx) => {
      const seen = new Set<string>();
      for (const raw of v.emails) {
        const e = raw.trim().toLowerCase();
        if (!isValidEmail(e)) {
          ctx.addIssue({ code: "custom", path: ["emails"], message: `"${raw}" isn't a valid email address` });
          break;
        }
        if (seen.has(e)) {
          ctx.addIssue({ code: "custom", path: ["emails"], message: `${raw} is listed twice` });
          break;
        }
        if (memberEmails.includes(e)) {
          ctx.addIssue({ code: "custom", path: ["emails"], message: `${raw} is already on the team or invited` });
          break;
        }
        seen.add(e);
      }
      if (assignableRoleIds.length && v.roleId && !assignableRoleIds.includes(v.roleId)) ctx.addIssue({ code: "custom", path: ["roleId"], message: "This role can't be assigned by invitation" });
    });
export type InviteFormValues = z.infer<ReturnType<typeof inviteFormSchema>>;

/** Change-role modal. */
export const changeRoleSchema = (currentRoleId: string) =>
  z.object({
    roleId: z.string().min(1, "Choose a role").refine((id) => id !== currentRoleId, "Pick a different role than the current one"),
  });
export type ChangeRoleValues = z.infer<ReturnType<typeof changeRoleSchema>>;

// ---------------------------------------------------------------- store records (seed / storage sanity)
const isoSchema = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

export const teamRoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(ROLE_NAME_MAX),
  description: z.string().max(ROLE_DESCRIPTION_MAX),
  tone: z.enum(ROLE_TONES),
  isSystem: z.boolean(),
  isLocked: z.boolean(),
  permissions: permissionsSchema,
  createdAt: isoSchema,
  updatedAt: isoSchema,
});

export const teamMemberSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().max(80),
    email: z.string().refine(isValidEmail, "Invalid email"),
    roleId: z.string().min(1),
    status: z.enum(["ACTIVE", "INVITED", "SUSPENDED"]),
    isOwner: z.boolean(),
    twoFactorEnabled: z.boolean(),
    lastActiveAt: isoSchema.nullable(),
    lastLoginIp: z.string(),
    location: z.string(),
    joinedAt: isoSchema.nullable(),
    invite: z
      .object({
        status: z.enum(["PENDING", "EXPIRED"]),
        sentAt: isoSchema,
        expiresAt: isoSchema,
        message: z.string().max(INVITE_MESSAGE_MAX),
        invitedBy: z.string().min(1),
        resentCount: z.number().int().min(0),
      })
      .nullable(),
  })
  .superRefine((m, ctx) => {
    if (m.status === "INVITED" && !m.invite) ctx.addIssue({ code: "custom", path: ["invite"], message: "Invited members need invite details" });
    if (m.status !== "INVITED" && (m.invite || !m.joinedAt || !m.name)) ctx.addIssue({ code: "custom", path: ["status"], message: "Joined members need a name and join date, and no invite" });
  });

export const teamEventSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "INVITED",
    "INVITE_RESENT",
    "INVITE_REVOKED",
    "JOINED",
    "ROLE_CHANGED",
    "SUSPENDED",
    "REACTIVATED",
    "REMOVED",
    "TWO_FA_ENABLED",
    "TWO_FA_RESET",
    "ROLE_CREATED",
    "ROLE_UPDATED",
    "ROLE_DELETED",
  ]),
  actor: z.string().min(1),
  targetId: z.string().nullable(),
  targetName: z.string().min(1),
  detail: z.string(),
  at: isoSchema,
});
