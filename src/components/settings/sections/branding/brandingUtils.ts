import type { BrandingSettings } from "@/validations/platformSettingsSchema";

export type BrandAccent = BrandingSettings["accent"];

/** Friendly audit labels for changed fields. */
export const BRANDING_LABELS: Partial<Record<keyof BrandingSettings, string>> = {
  logoUrl: "Logo",
  logoDarkUrl: "Dark logo",
  faviconUrl: "Favicon",
  loginImageUrl: "Login background",
  accent: "Accent colour",
  loginHeadline: "Login headline",
  loginSubtext: "Login subtext",
  footerText: "Footer text",
  showPoweredBy: "Powered by badge",
};

export const HEADLINE_MAX = 80;
export const SUBTEXT_MAX = 160;
export const FOOTER_MAX = 120;

/** Upload fields that can have a session-only on-screen preview. */
export type BrandingImageField = "logoUrl" | "logoDarkUrl" | "faviconUrl" | "loginImageUrl";
export type BrandingPreviews = Partial<Record<BrandingImageField, string>>;

export interface AccentStyle {
  label: string;
  /** Where it fits, for the swatch caption. */
  hint: string;
  solid: string;
  soft: string;
  text: string;
  ring: string;
  /** Login side-panel gradient (token colours only). */
  gradient: string;
}

export const ACCENT_ORDER: BrandAccent[] = ["orange", "blue", "green", "purple", "navy"];

/** Accent preset → globals.css colour tokens (the only colours a brand accent may use). */
export const ACCENT_STYLE: Record<BrandAccent, AccentStyle> = {
  orange: {
    label: "Orange",
    hint: "Energetic · default",
    solid: "bg-brand-orange",
    soft: "bg-brand-orange-light",
    text: "text-brand-orange",
    ring: "ring-brand-orange",
    gradient: "bg-linear-to-br from-brand-orange to-brand-accent",
  },
  blue: { label: "Blue", hint: "Calm · trustworthy", solid: "bg-blue", soft: "bg-blue-14", text: "text-blue", ring: "ring-blue", gradient: "bg-linear-to-br from-blue to-blue/60" },
  green: { label: "Green", hint: "Fresh · growth", solid: "bg-green", soft: "bg-green-bg", text: "text-green", ring: "ring-green", gradient: "bg-linear-to-br from-green to-green/60" },
  purple: { label: "Purple", hint: "Creative · bold", solid: "bg-purple", soft: "bg-purple-14", text: "text-purple", ring: "ring-purple", gradient: "bg-linear-to-br from-purple to-purple/60" },
  navy: {
    label: "Navy",
    hint: "Corporate · serious",
    solid: "bg-brand-navy",
    soft: "bg-slate-100",
    text: "text-brand-navy",
    ring: "ring-brand-navy",
    gradient: "bg-linear-to-br from-brand-navy to-brand-card",
  },
};
