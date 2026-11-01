import React from "react";
import { BarChart3, Cloud, MonitorPlay, Sparkles, Video } from "lucide-react";
import type { IntegrationKey } from "@/validations/platformSettingsSchema";

export type IntegrationTone = "blue" | "green" | "yellow" | "purple" | "orange";

export interface IntegrationOptionMeta {
  label: string;
  /** "select": fixed choices; "text": free input validated by `pattern`. */
  kind: "select" | "text";
  choices?: { value: string; label: string }[];
  placeholder?: string;
  pattern?: RegExp;
  patternMessage?: string;
  helper?: string;
}

export interface IntegrationMeta {
  key: IntegrationKey;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  tone: IntegrationTone;
  accountLabel: string;
  accountPlaceholder: string;
  apiKeyLabel: string;
  /** API key needed on first connect (false = optional). */
  requiresApiKey: boolean;
  option?: IntegrationOptionMeta;
}

export const AI_MODELS = [
  { value: "llama-3.3-70b", label: "Llama 3.3 70B (Groq)" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
];

export const INTEGRATIONS: IntegrationMeta[] = [
  {
    key: "zoom",
    name: "Zoom",
    category: "Video",
    description: "Schedule and launch live classes as Zoom meetings, with recordings synced back.",
    icon: <Video className="h-5 w-5" />,
    tone: "blue",
    accountLabel: "Zoom account email",
    accountPlaceholder: "admin@yourschool.com",
    apiKeyLabel: "Server-to-Server OAuth secret",
    requiresApiKey: true,
  },
  {
    key: "googleMeet",
    name: "Google Meet",
    category: "Video",
    description: "Create Meet links for live sessions from your Google Workspace calendar.",
    icon: <MonitorPlay className="h-5 w-5" />,
    tone: "green",
    accountLabel: "Workspace domain",
    accountPlaceholder: "yourschool.com Workspace",
    apiKeyLabel: "Service account key",
    requiresApiKey: false,
  },
  {
    key: "cloudinary",
    name: "Cloudinary",
    category: "Media storage",
    description: "Store and optimise course images, thumbnails and video uploads.",
    icon: <Cloud className="h-5 w-5" />,
    tone: "yellow",
    accountLabel: "Cloud name",
    accountPlaceholder: "e.g. yourschool-media",
    apiKeyLabel: "API secret",
    requiresApiKey: true,
  },
  {
    key: "ai",
    name: "AI Assistant",
    category: "Groq / Gemini",
    description: "Power quiz generation, lesson summaries and the student help assistant.",
    icon: <Sparkles className="h-5 w-5" />,
    tone: "purple",
    accountLabel: "Provider account",
    accountPlaceholder: "e.g. Groq",
    apiKeyLabel: "API key",
    requiresApiKey: true,
    option: { label: "Model", kind: "select", choices: AI_MODELS, helper: "Used for every AI feature on the platform." },
  },
  {
    key: "googleAnalytics",
    name: "Google Analytics",
    category: "Analytics",
    description: "Track visits, sign-ups and course purchases in GA4.",
    icon: <BarChart3 className="h-5 w-5" />,
    tone: "orange",
    accountLabel: "Property name",
    accountPlaceholder: "e.g. EduPro — Production",
    apiKeyLabel: "Measurement Protocol API secret",
    requiresApiKey: false,
    option: {
      label: "Measurement ID",
      kind: "text",
      placeholder: "G-XXXXXXXXXX",
      pattern: /^G-[A-Z0-9]{4,12}$/i,
      patternMessage: "Use the GA4 format, e.g. G-AB12CD34EF",
      helper: "Find it in GA4 → Admin → Data streams.",
    },
  },
];

export const INTEGRATION_BY_KEY = Object.fromEntries(INTEGRATIONS.map((i) => [i.key, i])) as Record<IntegrationKey, IntegrationMeta>;

export const INTEGRATION_TILE: Record<IntegrationTone, string> = {
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  yellow: "bg-yellow-bg text-yellow",
  purple: "bg-purple-14 text-purple",
  orange: "bg-brand-orange-light text-brand-orange",
};

/** Friendly names for the audit log ("zoom.connected" → "Zoom connection"). */
export const INTEGRATION_LABELS: Record<string, string> = Object.fromEntries(
  INTEGRATIONS.flatMap((i) => [
    [`${i.key}.connected`, `${i.name} connection`],
    [`${i.key}.accountLabel`, `${i.name} ${i.accountLabel.toLowerCase()}`],
    [`${i.key}.apiKey`, `${i.name} ${i.apiKeyLabel.toLowerCase()}`],
    [`${i.key}.option`, `${i.name} ${(i.option?.label ?? "option").toLowerCase()}`],
  ])
);

export const optionLabel = (meta: IntegrationMeta, value: string) => meta.option?.choices?.find((c) => c.value === value)?.label ?? value;
