import { z } from "zod";

export const settingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  supportEmail: z.string().email("Valid support email is required"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid 6-char hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid 6-char hex color"),
  maintenanceMode: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
