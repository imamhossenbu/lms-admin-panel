/**
 * "Open as owner" from the Owner Console lands on `/#impersonate=<token>`: a 1-hour institution admin token
 * signed by the API. The token rides in the URL fragment (never sent to servers or in Referer headers);
 * this stores it as the session token and strips it from the address bar.
 */
export function consumeImpersonationToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/(?:^#|&)impersonate=([^&]+)/);
  if (!match) return null;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  const token = decodeURIComponent(match[1]);
  localStorage.setItem("admin_token", token);
  localStorage.removeItem("admin_user");
  return token;
}
