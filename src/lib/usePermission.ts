import type { PermissionAction, TeamModule } from "@/types/team";
import { useAppSelector } from "@/store/hooks";

/**
 * Team permission checks for the signed-in staff member (from GET /team/me, loaded by AuthGuard).
 * While access is still loading — or for accounts outside the team (e.g. the platform owner) —
 * everything is allowed: the API is the real gate and answers 403 anyway.
 */
export function useCan(module: TeamModule, action: PermissionAction = "view"): boolean {
  const { access, accessLoaded } = useAppSelector((s) => s.auth);
  if (!accessLoaded || !access) return true;
  return access.permissions[module]?.includes(action) ?? false;
}

/** Non-hook variant for lists (e.g. filtering sidebar items). */
export function canWith(access: { permissions: Record<string, string[]> } | null, module: TeamModule, action: PermissionAction = "view") {
  if (!access) return true;
  return access.permissions[module]?.includes(action) ?? false;
}
