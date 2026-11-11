"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Share2 } from "lucide-react";
import type { WebsiteFormValues } from "@/validations/websiteSchema";
import { InputField } from "@/components/ui/InputField";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";

const NETWORKS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-handle" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/your-academy" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@your-handle" },
] as const;

/** Social links (footer + Contact page icons; empty ones are hidden). */
export function SocialsCard() {
  const { register, formState: { errors } } = useFormContext<WebsiteFormValues>();
  return (
    <SettingsCard icon={<Share2 className="h-5 w-5" />} title="Social links" description="Shown as icons in the footer and on the Contact page." tone="blue">
      {NETWORKS.map((n) => (
        <SettingsRow key={n.key} label={n.label} htmlFor={`web-social-${n.key}`}>
          <InputField id={`web-social-${n.key}`} placeholder={n.placeholder} error={errors.socials?.[n.key]?.message} {...register(`socials.${n.key}`)} />
        </SettingsRow>
      ))}
    </SettingsCard>
  );
}

export default SocialsCard;
