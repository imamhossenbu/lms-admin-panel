import { authApi } from "@/lib/api";
import { teamAccessApi } from "@/lib/api/team";
import type { AppDispatch } from "@/store";
import { setAccess, setCredentials } from "@/store/slices/authSlice";
import { clearWorkspaceSaas, refreshWorkspaceSaas } from "@/lib/workspaceSaas";

/**
 * Loads the signed-in profile and team access (role + permissions) into the store.
 * Used after login and on every app start (AuthGuard). Team access failing (e.g. the account isn't a
 * team member) never blocks the session — the API still enforces permissions on every call.
 */
export async function loadSession(dispatch: AppDispatch, token: string) {
  const profile = await authApi.getProfile();
  dispatch(setCredentials({ user: profile, token }));
  // Plan + usage for this workspace (plan gates, billing banner); never keep a previous account's.
  clearWorkspaceSaas();
  void refreshWorkspaceSaas().catch(() => undefined);
  try {
    dispatch(setAccess(await teamAccessApi.me()));
  } catch {
    dispatch(setAccess(null));
  }
  return profile;
}
