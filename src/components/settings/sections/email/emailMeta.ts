import type { EmailSettings } from "@/validations/platformSettingsSchema";

/** Friendly names for the audit log. */
export const EMAIL_LABELS: Record<string, string> = {
  senderName: "Sender name",
  senderEmail: "Sender email",
  replyTo: "Reply-to",
  provider: "Delivery provider",
  resendApiKey: "Resend API key",
  smtpHost: "SMTP host",
  smtpPort: "SMTP port",
  smtpUser: "SMTP username",
  smtpPassword: "SMTP password",
  smtpSecure: "SMTP TLS/SSL",
  digestEnabled: "Weekly digest",
  digestDay: "Digest day",
};

export const SMTP_PORTS: { port: number; label: string }[] = [
  { port: 25, label: "25 · Plain" },
  { port: 465, label: "465 · SSL" },
  { port: 587, label: "587 · TLS" },
];

export const DIGEST_DAYS: { value: EmailSettings["digestDay"]; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SUNDAY", label: "Sunday" },
];
