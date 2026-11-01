import type { TeamMember } from "@/types/team";

export interface MockSession {
  id: string;
  device: string;
  mobile: boolean;
  location: string;
  lastSeenAt: string;
  current: boolean;
}

const DEVICES = [
  { device: "Chrome on macOS", mobile: false },
  { device: "Safari on iPhone", mobile: true },
  { device: "Edge on Windows", mobile: false },
  { device: "Chrome on Android", mobile: true },
  { device: "Firefox on Ubuntu", mobile: false },
];

const hash = (s: string) => Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Deterministic mock sign-in sessions for a member (none for invitations / suspended members). */
export function memberSessions(m: TeamMember): MockSession[] {
  if (m.status !== "ACTIVE" || !m.lastActiveAt) return [];
  const h = hash(m.id);
  const count = 1 + (h % 3);
  const last = Date.parse(m.lastActiveAt);
  return Array.from({ length: count }, (_, i) => {
    const d = DEVICES[(h + i * 2) % DEVICES.length];
    return {
      id: `${m.id}-s${i}`,
      device: d.device,
      mobile: d.mobile,
      location: i === 0 ? m.location : ["Dhaka, BD", "Chattogram, BD", "Gazipur, BD"][(h + i) % 3],
      lastSeenAt: new Date(last - i * (5 + (h % 7)) * 3600000).toISOString(),
      current: i === 0,
    };
  });
}
