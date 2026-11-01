"use client";

import React from "react";
import { Building2, CreditCard, Globe, GraduationCap, Mail, Palette, Plug, ShieldCheck, Wrench } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import { SETTINGS_SECTIONS, type SettingsSection } from "@/validations/platformSettingsSchema";

/**
 * Tab ids = the settingsStorage sections + "domain" (Domain reads/writes the SaaS store, so it isn't part of
 * SETTINGS_SECTIONS / useSettingsSection).
 */
export type SettingsTabId = SettingsSection | "domain";

export const SETTINGS_TABS: { id: SettingsTabId; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <Building2 /> },
  { id: "branding", label: "Branding", icon: <Palette /> },
  { id: "domain", label: "Domain", icon: <Globe /> },
  { id: "learning", label: "Learning", icon: <GraduationCap /> },
  { id: "payments", label: "Payments", icon: <CreditCard /> },
  { id: "email", label: "Email", icon: <Mail /> },
  { id: "security", label: "Security", icon: <ShieldCheck /> },
  { id: "integrations", label: "Integrations", icon: <Plug /> },
  { id: "maintenance", label: "Maintenance", icon: <Wrench /> },
];

/** `?section=` → a known section ("general" by default). */
export const parseSettingsSection = (v: string | null | undefined): SettingsTabId =>
  v === "domain" || (SETTINGS_SECTIONS as readonly string[]).includes(v ?? "") ? (v as SettingsTabId) : "general";

export interface SettingsTabsProps {
  active: SettingsTabId;
  onChange: (section: SettingsTabId) => void;
}

/** Capsule section switcher (shared PillTabs with icons); scrolls horizontally on small screens. */
export function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return <PillTabs<SettingsTabId> ariaLabel="Settings sections" idPrefix="settings" tabs={SETTINGS_TABS} activeId={active} onChange={onChange} />;
}

export default SettingsTabs;
