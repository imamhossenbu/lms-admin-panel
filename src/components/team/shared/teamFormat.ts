/** Dates for Team & Roles: "just now", "5m ago", "3h ago", "4d ago", then "Oct 12, 2026". */
export function timeAgo(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return "Never";
  const ms = now - Date.parse(iso);
  if (!Number.isFinite(ms)) return "Never";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return shortDate(iso);
}

export const shortDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export const fullDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

/** "in 5d", "in 3h", "in 20m" or "Expired 2d ago". */
export function expiresIn(iso: string, now: number = Date.now()): string {
  const ms = Date.parse(iso) - now;
  if (ms <= 0) return `Expired ${timeAgo(iso, now).toLowerCase()}`;
  const h = Math.floor(ms / 3600000);
  if (h >= 24) return `in ${Math.floor(h / 24)}d`;
  if (h >= 1) return `in ${h}h`;
  return `in ${Math.max(1, Math.floor(ms / 60000))}m`;
}

/** Day heading for timelines: "Today", "Yesterday" or "Mon, Oct 12". */
export function dayLabel(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(now) - start(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" });
}

export const clockTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

export const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
