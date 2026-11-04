import { apiClient } from "@/lib/api";
import type { RolePermissions } from "@/types/team";

/** GET /team/me — the signed-in staff member's role and effective permissions. */
export interface MyTeamAccess {
  memberId: string;
  roleId: string;
  roleName: string;
  isOwner: boolean;
  permissions: RolePermissions;
  twoFactorEnabled: boolean;
  /** Workspace requires admin 2FA and I haven't set it up yet. */
  twoFactorSetupRequired: boolean;
}

/** GET /team/invitations/accept?token= — what the accept page shows. */
export interface InvitationPreview {
  email: string;
  roleName: string;
  workspaceName: string;
  invitedBy: string;
  message: string;
  expiresAt: string;
  expired: boolean;
}

export const teamAccessApi = {
  me: async (): Promise<MyTeamAccess> => (await apiClient.get("/team/me")).data,
};

export const invitationApi = {
  preview: async (token: string): Promise<InvitationPreview> => (await apiClient.get("/team/invitations/accept", { params: { token } })).data,
  accept: async (body: { token: string; name: string; password: string }): Promise<{ joined: true; email: string }> =>
    (await apiClient.post("/team/invitations/accept", body)).data,
};
