"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { WEBSITE_LIMITS, type WebsiteFormValues } from "@/validations/websiteSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { LengthField } from "./LengthField";

/** Home-page hero headline + sub-headline ("_" draws the blinking cursor). */
export function HeroCard() {
  const { formState: { errors } } = useFormContext<WebsiteFormValues>();
  return (
    <SettingsCard icon={<Sparkles className="h-5 w-5" />} title="Hero" description="The first thing visitors read on your home page." tone="orange">
      <SettingsRow label="Headline" description='Put "_" where the glowing cursor should appear, e.g. "Build Skills_ Build Your Future". Empty = default.' htmlFor="web-hero-title">
        <LengthField name="hero.title" id="web-hero-title" max={WEBSITE_LIMITS.heroTitle} placeholder="Learn Today_ Lead Tomorrow" error={errors.hero?.title?.message} />
      </SettingsRow>
      <SettingsRow label="Sub-headline" description="One or two sentences under the headline. Empty = your tagline." htmlFor="web-hero-subtitle">
        <LengthField name="hero.subtitle" id="web-hero-subtitle" rows={3} max={WEBSITE_LIMITS.heroSubtitle} placeholder="Job-ready courses taught by people who do the work every day." error={errors.hero?.subtitle?.message} />
      </SettingsRow>
    </SettingsCard>
  );
}

export default HeroCard;
