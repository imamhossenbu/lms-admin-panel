"use client";

import type { PlatformSettings, SettingsSection } from "@/validations/platformSettingsSchema";
import { apiClient } from "@/lib/api";

/**
 * Platform Settings data layer, backed by the Settings API (`/admin/settings*`, workspace-scoped). Function names
 * match the earlier mock store. fetchSettings caches the store so getSettingsSnapshot returns the latest data;
 * every write announces SETTINGS_UPDATED_EVENT. Secrets never come back in clear, only as masked hints
 * ("••••1234"); an empty secret on save keeps the stored one. Errors are Axios errors (use apiErrorMessage).
 */

export const SETTINGS_UPDATED_EVENT = "edupro_settings_updated";

export interface SettingsAuditEntry {
  id: string;
  section: SettingsSection;
  /** Human list of changed fields, e.g. "Platform name, Timezone". */
  summary: string;
  actor: string;
  at: string;
}

export interface SettingsStore {
  settings: PlatformSettings;
  /** Masked secrets for display: key path → "••••1234". */
  secretHints: Record<string, string>;
  audit: SettingsAuditEntry[];
  /** ISO time of each section's last save ("" when never saved). */
  updatedAt: Record<SettingsSection, string>;
}

const SECTIONS: SettingsSection[] = ["general", "branding", "learning", "payments", "email", "security", "integrations", "maintenance"];

/** Placeholder store until the first fetch resolves (the page shows a skeleton until then). */
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
    secretHints: {},
    audit: [],
    updatedAt: Object.fromEntries(SECTIONS.map((k) => [k, ""])) as Record<SettingsSection, string>,
  };
}

let cache: SettingsStore | null = null;

function remember(store: SettingsStore & { backups?: unknown }): SettingsStore {
  const { settings, secretHints, audit, updatedAt } = store;
  cache = { settings, secretHints: secretHints ?? {}, audit: audit ?? [], updatedAt };
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
  return cache;
}

export const getSettingsSnapshot = (): SettingsStore => cache ?? defaultSettingsStore();

export async function fetchSettings(): Promise<SettingsStore> {
  const { data } = await apiClient.get<SettingsStore>("/admin/settings");
  return remember(data);
}

/**
 * Save one section. The API validates cross-field rules, encrypts non-empty secrets (empty → kept) and writes
 * the audit entry itself, so `changedLabels` is only used by callers for their toast.
 */
export async function saveSettingsSection<K extends SettingsSection>(section: K, values: PlatformSettings[K], changedLabels: string[] = []): Promise<SettingsStore> {
  void changedLabels;
  const { data } = await apiClient.patch<SettingsStore>(`/admin/settings/${section}`, values);
  return remember(data);
}

/** Remove a stored secret, e.g. "integrations.zoom.apiKey" on Disconnect. */
export async function clearSecret(path: string): Promise<SettingsStore> {
  const { data } = await apiClient.post<SettingsStore>("/admin/settings/secrets/clear", { path });
  return remember(data);
}

/** Sends a test message with the saved email settings; resolves with the recipient. */
export async function sendTestEmail(to: string): Promise<string> {
  const { data } = await apiClient.post<{ to: string }>("/admin/settings/email/test", { to });
  return data.to;
}

/** Checks the saved credentials of one integration. */
export async function testIntegration(key: string): Promise<{ ok: boolean; latencyMs: number }> {
  const { data } = await apiClient.post<{ ok: boolean; latencyMs: number }>(`/admin/settings/integrations/${encodeURIComponent(key)}/test`);
  return data;
}

export interface GatewayTestResult {
  ok: boolean;
  latencyMs: number;
  /** What the saved setup lacks: "enabled" | "publicKey" | "secretKey". */
  missing: string[];
}

/** Checks a payment gateway's saved setup (enabled, public key, stored secret key). */
export async function testGateway(key: string): Promise<GatewayTestResult> {
  const { data } = await apiClient.post<GatewayTestResult>(`/admin/settings/payments/${encodeURIComponent(key)}/test`);
  return data;
}

let clientIpRequest: Promise<string | null> | null = null;

/** The caller's IP as the API sees it (null when it can't be read). Fetched once per page load. */
export function fetchClientIp(): Promise<string | null> {
  clientIpRequest ??= apiClient.get<{ ip: string }>("/admin/settings/client-ip").then(
    ({ data }) => data.ip || null,
    () => {
      clientIpRequest = null;
      return null;
    }
  );
  return clientIpRequest;
}
