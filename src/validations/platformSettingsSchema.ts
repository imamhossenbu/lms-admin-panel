import { z } from "zod";

/**
 * Platform Settings — one zod schema per section; each section is its own form with its own Save.
 * Stored by the Settings API (/admin/settings) via src/lib/settingsStorage.ts.
 */

const optionalUrl = z.string().trim().refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+/.test(v), "Enter a valid URL starting with https://");
const phone = z.string().trim().refine((v) => v === "" || /^\+?[0-9\s-]{7,20}$/.test(v), "Enter a valid phone number");
const percent = (label: string) => z.number({ error: `Enter ${label}` }).min(0, "Can't be negative").max(100, "100 or less");

export const SETTINGS_SECTIONS = ["general", "branding", "learning", "payments", "email", "security", "integrations", "maintenance"] as const;
export type SettingsSection = (typeof SETTINGS_SECTIONS)[number];

// ---------------------------------------------------------------- General
export const generalSettingsSchema = z.object({
  platformName: z.string().trim().min(2, "Platform name is required").max(60, "60 characters or less"),
  tagline: z.string().trim().max(120, "120 characters or less"),
  supportEmail: z.string().trim().email("Enter a valid email"),
  supportPhone: phone,
  websiteUrl: optionalUrl,
  address: z.string().trim().max(200, "200 characters or less"),
  timezone: z.string().min(1, "Select a timezone"),
  dateFormat: z.enum(["MMM D, YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  timeFormat: z.enum(["12h", "24h"]),
  currency: z.enum(["USD", "BDT", "EUR", "GBP", "INR"]),
  weekStartsOn: z.enum(["SUNDAY", "MONDAY", "SATURDAY"]),
});

// ---------------------------------------------------------------- Branding
export const brandingSettingsSchema = z.object({
  logoUrl: z.string(),
  logoDarkUrl: z.string(),
  faviconUrl: z.string(),
  loginImageUrl: z.string(),
  /** Accent preset (token-based) used for highlights in student-facing apps. */
  accent: z.enum(["orange", "blue", "green", "purple", "navy"]),
  loginHeadline: z.string().trim().min(3, "Headline is required").max(80, "80 characters or less"),
  loginSubtext: z.string().trim().max(160, "160 characters or less"),
  footerText: z.string().trim().max(120, "120 characters or less"),
  showPoweredBy: z.boolean(),
});

// ---------------------------------------------------------------- Learning
export const learningSettingsSchema = z.object({
  enrollmentApproval: z.enum(["AUTO", "MANUAL"]),
  allowGuestPreview: z.boolean(),
  completionThreshold: z.number({ error: "Enter a percentage" }).int().min(50, "At least 50%").max(100, "100% or less"),
  sequentialLessons: z.boolean(),
  allowReviews: z.boolean(),
  reviewModeration: z.boolean(),
  enableCommunity: z.boolean(),
  autoIssueCertificates: z.boolean(),
  maxUploadMb: z.number({ error: "Enter a size" }).int().min(1, "At least 1 MB").max(2048, "Up to 2048 MB"),
  defaultPassingScore: percent("a passing score"),
  lateSubmissionPenalty: percent("a penalty"),
});

// ---------------------------------------------------------------- Payments
export const gatewaySchema = z.object({
  enabled: z.boolean(),
  mode: z.enum(["LIVE", "TEST"]),
  /** Public / store id (shown). */
  publicKey: z.string().trim(),
  /** Secret — only "••••last4" is ever shown; empty string = unchanged. */
  secretKey: z.string().trim(),
});
export const paymentSettingsSchema = z
  .object({
    sslcommerz: gatewaySchema,
    stripe: gatewaySchema,
    bkash: gatewaySchema,
    taxRate: percent("a tax rate"),
    taxInclusive: z.boolean(),
    refundWindowDays: z.number({ error: "Enter days" }).int().min(0, "0 or more").max(90, "Up to 90 days"),
    invoicePrefix: z.string().trim().min(2, "At least 2 characters").max(8, "8 characters or less").regex(/^[A-Z0-9-]+$/, "Use capital letters, numbers and dashes"),
    invoiceFooter: z.string().trim().max(200, "200 characters or less"),
  })
  .superRefine((v, ctx) => {
    if (!v.sslcommerz.enabled && !v.stripe.enabled && !v.bkash.enabled)
      ctx.addIssue({ code: "custom", path: ["sslcommerz", "enabled"], message: "Enable at least one payment gateway" });
    (["sslcommerz", "stripe", "bkash"] as const).forEach((g) => {
      if (v[g].enabled && !v[g].publicKey) ctx.addIssue({ code: "custom", path: [g, "publicKey"], message: "Required when the gateway is enabled" });
    });
  });

// ---------------------------------------------------------------- Email
export const emailSettingsSchema = z
  .object({
    senderName: z.string().trim().min(2, "Sender name is required").max(60, "60 characters or less"),
    senderEmail: z.string().trim().email("Enter a valid email"),
    replyTo: z.string().trim().refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email"),
    provider: z.enum(["RESEND", "SMTP"]),
    resendApiKey: z.string().trim(),
    smtpHost: z.string().trim(),
    smtpPort: z.number({ error: "Enter a port" }).int().min(1, "1–65535").max(65535, "1–65535"),
    smtpUser: z.string().trim(),
    smtpPassword: z.string().trim(),
    smtpSecure: z.boolean(),
    digestEnabled: z.boolean(),
    digestDay: z.enum(["MONDAY", "FRIDAY", "SUNDAY"]),
  })
  .superRefine((v, ctx) => {
    if (v.provider === "SMTP" && !v.smtpHost) ctx.addIssue({ code: "custom", path: ["smtpHost"], message: "SMTP host is required" });
    if (v.provider === "SMTP" && !v.smtpUser) ctx.addIssue({ code: "custom", path: ["smtpUser"], message: "SMTP username is required" });
  });

// ---------------------------------------------------------------- Security
export const securitySettingsSchema = z
  .object({
    requireAdmin2fa: z.boolean(),
    passwordMinLength: z.number({ error: "Enter a length" }).int().min(8, "At least 8").max(64, "Up to 64"),
    requireUppercase: z.boolean(),
    requireNumber: z.boolean(),
    requireSymbol: z.boolean(),
    passwordExpiryDays: z.number().int().min(30, "At least 30 days").max(365, "Up to 365 days").nullable(),
    sessionTimeoutMinutes: z.number({ error: "Enter minutes" }).int().min(5, "At least 5 minutes").max(1440, "Up to 24 hours"),
    maxLoginAttempts: z.number({ error: "Enter a number" }).int().min(3, "At least 3").max(20, "Up to 20"),
    lockoutMinutes: z.number({ error: "Enter minutes" }).int().min(1, "At least 1 minute").max(1440, "Up to 24 hours"),
    ipAllowlistEnabled: z.boolean(),
    /** One IPv4 / CIDR per entry. */
    ipAllowlist: z.array(z.string().trim().regex(/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/, "Use an IPv4 address or CIDR (e.g. 10.0.0.0/24)")).max(50, "Up to 50 entries"),
  })
  .superRefine((v, ctx) => {
    if (v.ipAllowlistEnabled && v.ipAllowlist.length === 0) ctx.addIssue({ code: "custom", path: ["ipAllowlist"], message: "Add at least one IP or turn the allowlist off" });
  });

// ---------------------------------------------------------------- Integrations
export const integrationKeys = ["zoom", "googleMeet", "cloudinary", "ai", "googleAnalytics"] as const;
export type IntegrationKey = (typeof integrationKeys)[number];
export const integrationSchema = z.object({
  connected: z.boolean(),
  /** Account / client id shown once connected. */
  accountLabel: z.string().trim(),
  apiKey: z.string().trim(),
  /** Extra per-integration option (e.g. AI model, GA measurement id). */
  option: z.string().trim(),
});
export const integrationsSettingsSchema = z.object({
  zoom: integrationSchema,
  googleMeet: integrationSchema,
  cloudinary: integrationSchema,
  ai: integrationSchema,
  googleAnalytics: integrationSchema,
});

// ---------------------------------------------------------------- Maintenance
export const maintenanceSettingsSchema = z
  .object({
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string().trim().max(200, "200 characters or less"),
    /** ISO or "" — expected end shown to visitors. */
    maintenanceUntil: z.string(),
    allowAdminsDuringMaintenance: z.boolean(),
    autoBackup: z.boolean(),
    backupFrequency: z.enum(["DAILY", "WEEKLY"]),
    backupRetentionDays: z.number({ error: "Enter days" }).int().min(7, "At least 7 days").max(365, "Up to 365 days"),
  })
  .superRefine((v, ctx) => {
    if (v.maintenanceMode && v.maintenanceMessage.length < 10)
      ctx.addIssue({ code: "custom", path: ["maintenanceMessage"], message: "Tell visitors what's happening (at least 10 characters)" });
  });

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>;
export type LearningSettings = z.infer<typeof learningSettingsSchema>;
export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;
export type GatewaySettings = z.infer<typeof gatewaySchema>;
export type EmailSettings = z.infer<typeof emailSettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type IntegrationSettings = z.infer<typeof integrationSchema>;
export type IntegrationsSettings = z.infer<typeof integrationsSettingsSchema>;
export type MaintenanceSettings = z.infer<typeof maintenanceSettingsSchema>;

export interface PlatformSettings {
  general: GeneralSettings;
  branding: BrandingSettings;
  learning: LearningSettings;
  payments: PaymentSettings;
  email: EmailSettings;
  security: SecuritySettings;
  integrations: IntegrationsSettings;
  maintenance: MaintenanceSettings;
}

export const SETTINGS_SCHEMAS = {
  general: generalSettingsSchema,
  branding: brandingSettingsSchema,
  learning: learningSettingsSchema,
  payments: paymentSettingsSchema,
  email: emailSettingsSchema,
  security: securitySettingsSchema,
  integrations: integrationsSettingsSchema,
  maintenance: maintenanceSettingsSchema,
} as const;
