import type { Tone } from "@/components/ui/ToneBadge";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";

/** Human labels for the audit log ("sessionTimeoutMinutes" → "Session timeout"). */
export const SECURITY_LABELS: Partial<Record<keyof SecuritySettings, string>> = {
  requireAdmin2fa: "Admin two-factor",
  passwordMinLength: "Password length",
  requireUppercase: "Uppercase rule",
  requireNumber: "Number rule",
  requireSymbol: "Symbol rule",
  passwordExpiryDays: "Password expiry",
  sessionTimeoutMinutes: "Session timeout",
  maxLoginAttempts: "Max failed attempts",
  lockoutMinutes: "Lockout duration",
  ipAllowlistEnabled: "IP allowlist",
  ipAllowlist: "Allowed IPs",
};

export const SESSION_PRESETS = [
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 hour" },
  { minutes: 120, label: "2 hours" },
  { minutes: 480, label: "8 hours" },
] as const;

const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** "90 minutes" → "1 h 30 min" style. */
export function formatMinutes(min: number) {
  if (!valid(min) || min <= 0) return "—";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"}`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} hour${h === 1 ? "" : "s"}`;
}

// ---------------------------------------------------------------- IP allowlist
const IP_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/;

/** Stricter than the schema (octets 0–255, prefix 0–32). Returns an error message or null. */
export function ipEntryError(entry: string): string | null {
  const m = IP_RE.exec(entry.trim());
  if (!m) return "Not an IPv4 address or CIDR";
  if (m.slice(1, 5).some((o) => Number(o) > 255)) return "Each part must be 0–255";
  if (m[5] !== undefined && Number(m[5]) > 32) return "CIDR prefix must be 0–32";
  return null;
}

/** Mock "your current IP" for the lock-out warning. */
export const MOCK_CURRENT_IP = "103.94.135.22";

const toInt = (ip: string) => ip.split(".").reduce((acc, o) => acc * 256 + Number(o), 0);

/** True when `ip` is covered by any entry (exact or CIDR range). */
export function ipIsAllowed(ip: string, list: string[]) {
  const target = toInt(ip);
  return list.some((entry) => {
    if (ipEntryError(entry)) return false;
    const [base, prefix] = entry.split("/");
    if (prefix === undefined) return base === ip;
    const block = Math.pow(2, 32 - Number(prefix));
    return Math.floor(toInt(base) / block) === Math.floor(target / block);
  });
}

// ---------------------------------------------------------------- password checker
export interface PasswordRule {
  key: string;
  label: string;
  met: boolean;
}

export function passwordRules(pw: string, s: Pick<SecuritySettings, "passwordMinLength" | "requireUppercase" | "requireNumber" | "requireSymbol">): PasswordRule[] {
  const min = valid(s.passwordMinLength) ? s.passwordMinLength : 8;
  const rules: PasswordRule[] = [{ key: "length", label: `At least ${min} characters`, met: pw.length >= min }];
  if (s.requireUppercase) rules.push({ key: "upper", label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(pw) });
  if (s.requireNumber) rules.push({ key: "number", label: "One number (0–9)", met: /\d/.test(pw) });
  if (s.requireSymbol) rules.push({ key: "symbol", label: "One symbol (!@#$…)", met: /[^A-Za-z0-9]/.test(pw) });
  return rules;
}

export interface StrengthResult {
  /** 0–4 filled segments. */
  level: number;
  label: string;
  tone: Tone;
  barClass: string;
}

const STRENGTH: Omit<StrengthResult, "level">[] = [
  { label: "Type a password", tone: "gray", barClass: "bg-slate-200" },
  { label: "Weak", tone: "red", barClass: "bg-red" },
  { label: "Fair", tone: "yellow", barClass: "bg-yellow" },
  { label: "Good", tone: "blue", barClass: "bg-blue" },
  { label: "Strong", tone: "green", barClass: "bg-green" },
];

/** Strength against the current policy: failing any rule caps it at "Weak". */
export function passwordStrength(pw: string, rules: PasswordRule[]): StrengthResult {
  if (!pw) return { level: 0, ...STRENGTH[0] };
  if (rules.some((r) => !r.met)) return { level: 1, ...STRENGTH[1] };
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length;
  const level = Math.min(4, Math.max(2, (pw.length >= 12 ? 2 : 1) + (variety >= 3 ? 1 : 0) + (variety === 4 && pw.length >= 14 ? 1 : 0)));
  return { level, ...STRENGTH[level] };
}

// ---------------------------------------------------------------- security score
export interface ScoreItem {
  key: string;
  points: number;
  met: boolean;
  /** Shown in the suggestions list when not met. */
  suggestion: string;
}

export function securityScore(s: Partial<SecuritySettings>): { score: number; items: ScoreItem[] } {
  const items: ScoreItem[] = [
    { key: "2fa", points: 30, met: !!s.requireAdmin2fa, suggestion: "Require two-factor authentication for admins" },
    { key: "length", points: 15, met: valid(s.passwordMinLength) && s.passwordMinLength >= 12, suggestion: "Raise the minimum password length to 12+" },
    { key: "symbol", points: 10, met: !!s.requireSymbol, suggestion: "Require at least one symbol" },
    { key: "number", points: 10, met: !!s.requireNumber, suggestion: "Require at least one number" },
    { key: "upper", points: 10, met: !!s.requireUppercase, suggestion: "Require an uppercase letter" },
    { key: "timeout", points: 10, met: valid(s.sessionTimeoutMinutes) && s.sessionTimeoutMinutes <= 120, suggestion: "Sign idle admins out within 2 hours" },
    { key: "lockout", points: 10, met: valid(s.maxLoginAttempts) && valid(s.lockoutMinutes) && s.lockoutMinutes > 0, suggestion: "Lock accounts after repeated failed sign-ins" },
    { key: "allowlist", points: 5, met: !!s.ipAllowlistEnabled && (s.ipAllowlist?.length ?? 0) > 0, suggestion: "Restrict admin access to trusted IPs" },
  ];
  return { score: items.reduce((sum, i) => sum + (i.met ? i.points : 0), 0), items };
}

export function scoreMeta(score: number): { label: string; tone: Tone; strokeClass: string } {
  if (score >= 85) return { label: "Excellent", tone: "green", strokeClass: "stroke-green" };
  if (score >= 65) return { label: "Good", tone: "blue", strokeClass: "stroke-blue" };
  if (score >= 40) return { label: "Fair", tone: "yellow", strokeClass: "stroke-yellow" };
  return { label: "At risk", tone: "red", strokeClass: "stroke-red" };
}
