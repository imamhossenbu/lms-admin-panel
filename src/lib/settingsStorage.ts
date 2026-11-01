import type { PlatformSettings, SettingsSection } from "@/validations/platformSettingsSchema";

/**
 * Mock-first persistence for Platform Settings (localStorage + simulated latency).
 * Secrets are never stored in clear: saveSettingsSection keeps the previous secret when the
 * submitted one is empty and stores only a masked "••••last4" hint for display.
 */

const STORAGE_KEY = "edupro_settings_v1";
export const SETTINGS_UPDATED_EVENT = "edupro_settings_updated";
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export interface SettingsAuditEntry {
  id: string;
  section: SettingsSection;
  /** Human list of changed fields, e.g. "Platform name, Timezone". */
  summary: string;
  actor: string;
  at: string;
}

export interface BackupEntry {
  id: string;
  at: string;
  sizeMb: number;
  kind: "AUTO" | "MANUAL";
  status: "COMPLETED" | "FAILED";
}

export interface SettingsStore {
  settings: PlatformSettings;
  /** Masked secrets for display: key path → "••••1234". */
  secretHints: Record<string, string>;
  audit: SettingsAuditEntry[];
  backups: BackupEntry[];
  updatedAt: Record<SettingsSection, string>;
}

const iso = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();
const H = 3600000;

export function defaultSettingsStore(): SettingsStore {
  const settings: PlatformSettings = {
    general: {
      platformName: "EduPro",
      tagline: "Learn skills that move your career forward",
      supportEmail: "support@edupro.com",
      supportPhone: "+880 1700-000000",
      websiteUrl: "https://edupro.com",
      address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
      timezone: "Asia/Dhaka",
      dateFormat: "MMM D, YYYY",
      timeFormat: "12h",
      currency: "USD",
      weekStartsOn: "SATURDAY",
    },
    branding: {
      logoUrl: "",
      logoDarkUrl: "",
      faviconUrl: "",
      loginImageUrl: "",
      accent: "orange",
      loginHeadline: "Welcome back to EduPro",
      loginSubtext: "Manage courses, students and payments from one place.",
      footerText: "© 2026 EduPro. All rights reserved.",
      showPoweredBy: true,
    },
    learning: {
      enrollmentApproval: "AUTO",
      allowGuestPreview: true,
      completionThreshold: 90,
      sequentialLessons: false,
      allowReviews: true,
      reviewModeration: true,
      enableCommunity: true,
      autoIssueCertificates: true,
      maxUploadMb: 50,
      defaultPassingScore: 70,
      lateSubmissionPenalty: 10,
    },
    payments: {
      sslcommerz: { enabled: true, mode: "LIVE", publicKey: "edupro_live_store", secretKey: "" },
      stripe: { enabled: true, mode: "TEST", publicKey: "pk_test_51Nx…", secretKey: "" },
      bkash: { enabled: false, mode: "TEST", publicKey: "", secretKey: "" },
      taxRate: 5,
      taxInclusive: false,
      refundWindowDays: 14,
      invoicePrefix: "INV",
      invoiceFooter: "Thank you for learning with EduPro.",
    },
    email: {
      senderName: "EduPro",
      senderEmail: "no-reply@edupro.com",
      replyTo: "support@edupro.com",
      provider: "RESEND",
      resendApiKey: "",
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      smtpSecure: true,
      digestEnabled: true,
      digestDay: "MONDAY",
    },
    security: {
      requireAdmin2fa: true,
      passwordMinLength: 10,
      requireUppercase: true,
      requireNumber: true,
      requireSymbol: false,
      passwordExpiryDays: null,
      sessionTimeoutMinutes: 120,
      maxLoginAttempts: 5,
      lockoutMinutes: 15,
      ipAllowlistEnabled: false,
      ipAllowlist: [],
    },
    integrations: {
      zoom: { connected: true, accountLabel: "admin@edupro.com", apiKey: "", option: "" },
      googleMeet: { connected: true, accountLabel: "edupro.com Workspace", apiKey: "", option: "" },
      cloudinary: { connected: true, accountLabel: "edupro-media", apiKey: "", option: "" },
      ai: { connected: true, accountLabel: "Groq", apiKey: "", option: "llama-3.3-70b" },
      googleAnalytics: { connected: false, accountLabel: "", apiKey: "", option: "" },
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: "We're upgrading EduPro. We'll be back shortly.",
      maintenanceUntil: "",
      allowAdminsDuringMaintenance: true,
      autoBackup: true,
      backupFrequency: "DAILY",
      backupRetentionDays: 30,
    },
  };
  return {
    settings,
    secretHints: {
      "payments.sslcommerz.secretKey": "••••8f2a",
      "payments.stripe.secretKey": "••••4e19",
      "email.resendApiKey": "••••c7d0",
      "integrations.zoom.apiKey": "••••91be",
      "integrations.cloudinary.apiKey": "••••02af",
      "integrations.ai.apiKey": "••••6b3c",
    },
    audit: [
      { id: "audit-1", section: "payments", summary: "Stripe mode, Tax rate", actor: "Admin", at: iso(26 * H) },
      { id: "audit-2", section: "branding", summary: "Login headline", actor: "Admin", at: iso(3 * 24 * H) },
      { id: "audit-3", section: "security", summary: "Session timeout", actor: "Nadia Karim", at: iso(9 * 24 * H) },
      { id: "audit-4", section: "general", summary: "Support phone", actor: "Admin", at: iso(15 * 24 * H) },
    ],
    backups: Array.from({ length: 7 }, (_, i) => ({
      id: `backup-${i + 1}`,
      at: iso((i * 24 + 3) * H),
      sizeMb: Math.round((412 - i * 6.5) * 10) / 10,
      kind: i === 2 ? "MANUAL" : "AUTO",
      status: i === 4 ? "FAILED" : "COMPLETED",
    })),
    updatedAt: {
      general: iso(15 * 24 * H),
      branding: iso(3 * 24 * H),
      learning: iso(40 * 24 * H),
      payments: iso(26 * H),
      email: iso(60 * 24 * H),
      security: iso(9 * 24 * H),
      integrations: iso(20 * 24 * H),
      maintenance: iso(90 * 24 * H),
    },
  };
}

function read(): SettingsStore {
  if (typeof window === "undefined") return defaultSettingsStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as SettingsStore;
      if (p?.settings && p.updatedAt) return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = defaultSettingsStore();
  write(seed);
  return seed;
}

function write(s: SettingsStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
}

export const getSettingsSnapshot = () => read();
export async function fetchSettings(): Promise<SettingsStore> {
  await wait(300);
  return read();
}

const SECRET_FIELDS: Record<SettingsSection, string[]> = {
  general: [],
  branding: [],
  learning: [],
  payments: ["sslcommerz.secretKey", "stripe.secretKey", "bkash.secretKey"],
  email: ["resendApiKey", "smtpPassword"],
  security: [],
  integrations: ["zoom.apiKey", "googleMeet.apiKey", "cloudinary.apiKey", "ai.apiKey", "googleAnalytics.apiKey"],
  maintenance: [],
};

const getPath = (o: unknown, path: string): unknown => path.split(".").reduce<unknown>((x, k) => (x && typeof x === "object" ? (x as Record<string, unknown>)[k] : undefined), o);
const setPath = (o: Record<string, unknown>, path: string, v: unknown) => {
  const keys = path.split(".");
  let cur = o;
  keys.slice(0, -1).forEach((k) => (cur = cur[k] as Record<string, unknown>));
  cur[keys[keys.length - 1]] = v;
};

/**
 * Save one section. `changedLabels` (human field names) feeds the audit log.
 * Secret fields: non-empty → stored as a masked hint (never in clear); empty → previous hint kept.
 */
export async function saveSettingsSection<K extends SettingsSection>(section: K, values: PlatformSettings[K], changedLabels: string[]): Promise<SettingsStore> {
  await wait();
  const s = read();
  const clean = structuredClone(values) as unknown as Record<string, unknown>;
  const hints = { ...s.secretHints };
  SECRET_FIELDS[section].forEach((path) => {
    const v = getPath(clean, path);
    if (typeof v === "string" && v.length > 0) hints[`${section}.${path}`] = `••••${v.slice(-4)}`;
    setPath(clean, path, "");
  });
  const now = new Date().toISOString();
  const next: SettingsStore = {
    ...s,
    settings: { ...s.settings, [section]: clean },
    secretHints: hints,
    updatedAt: { ...s.updatedAt, [section]: now },
    audit: changedLabels.length
      ? [{ id: `audit-${Date.now().toString(36)}`, section, summary: changedLabels.slice(0, 4).join(", ") + (changedLabels.length > 4 ? ` +${changedLabels.length - 4} more` : ""), actor: "Admin", at: now }, ...s.audit].slice(0, 50)
      : s.audit,
  };
  write(next);
  return next;
}

/** Remove a stored secret (e.g. disconnect an integration). */
export async function clearSecret(path: string) {
  await wait(250);
  const s = read();
  const hints = { ...s.secretHints };
  delete hints[path];
  write({ ...s, secretHints: hints });
}

// ---------------------------------------------------------------- mock actions
export async function sendTestEmail(to: string): Promise<string> {
  await wait(900);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) throw new Error("Enter a valid email address.");
  return to;
}

export async function testIntegration(key: string): Promise<{ ok: boolean; latencyMs: number }> {
  await wait(800);
  return { ok: key !== "googleAnalytics" || !!read().settings.integrations.googleAnalytics.connected, latencyMs: 120 + Math.round(Math.random() * 180) };
}

export async function runBackupNow(): Promise<BackupEntry> {
  await wait(1500);
  const s = read();
  const entry: BackupEntry = { id: `backup-${Date.now().toString(36)}`, at: new Date().toISOString(), sizeMb: Math.round(((s.backups[0]?.sizeMb ?? 400) + 1.2) * 10) / 10, kind: "MANUAL", status: "COMPLETED" };
  write({ ...s, backups: [entry, ...s.backups].slice(0, 30) });
  return entry;
}

/** Wipe all mock data in this browser (every edupro_* localStorage/sessionStorage key) and reload. */
export function resetAllMockData() {
  if (typeof window === "undefined") return;
  Object.keys(localStorage).filter((k) => k.startsWith("edupro_")).forEach((k) => localStorage.removeItem(k));
  Object.keys(sessionStorage).filter((k) => k.startsWith("edupro_")).forEach((k) => sessionStorage.removeItem(k));
}
