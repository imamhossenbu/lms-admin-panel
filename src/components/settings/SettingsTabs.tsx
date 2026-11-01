"use client";

import React from "react";
import { Building2, CreditCard, GraduationCap, Mail, Palette, Plug, ShieldCheck, Wrench } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import { SETTINGS_SECTIONS, type SettingsSection } from "@/validations/platformSettingsSchema";

export const SETTINGS_TABS: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <Building2 /> },
  { id: "branding", label: "Branding", icon: <Palette /> },
  { id: "learning", label: "Learning", icon: <GraduationCap /> },
  { id: "payments", label: "Payments", icon: <CreditCard /> },
  { id: "email", label: "Email", icon: <Mail /> },
  { id: "security", label: "Security", icon: <ShieldCheck /> },
  { id: "integrations", label: "Integrations", icon: <Plug /> },
  { id: "maintenance", label: "Maintenance", icon: <Wrench /> },
];

/** `?section=` → a known section ("general" by default). */
export const parseSettingsSection = (v: string | null | undefined): SettingsSection =>
  (SETTINGS_SECTIONS as readonly string[]).includes(v ?? "") ? (v as SettingsSection) : "general";

export interface SettingsTabsProps {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
}

/** Capsule section switcher (shared PillTabs with icons); scrolls horizontally on small screens. */
export function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return <PillTabs<SettingsSection> ariaLabel="Settings sections" idPrefix="settings" tabs={SETTINGS_TABS} activeId={active} onChange={onChange} />;
}

export default SettingsTabs;
