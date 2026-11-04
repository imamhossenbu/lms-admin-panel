import { apiClient } from "@/lib/api";

/** Signed-in user's own two-factor authentication (TOTP authenticator app). */
export interface TwoFactorSetup {
  secret: string;
  otpauthUrl: string;
  /** PNG data URL of the QR code to scan. */
  qrCodeDataUrl: string;
}

export const twoFactorApi = {
  status: async (): Promise<{ enabled: boolean }> => (await apiClient.get("/auth/2fa")).data,
  setup: async (): Promise<TwoFactorSetup> => (await apiClient.post("/auth/2fa/setup")).data,
  enable: async (code: string): Promise<{ enabled: true }> => (await apiClient.post("/auth/2fa/enable", { code })).data,
  disable: async (code: string): Promise<{ enabled: false }> => (await apiClient.post("/auth/2fa/disable", { code })).data,
};
