"use client";

import React from "react";
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import { Clock, Mail } from "lucide-react";
import { WEBSITE_LIMITS, type WebsiteFormValues } from "@/validations/websiteSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { LengthField } from "./LengthField";

/** Newsletter sign-up copy + on/off, and contact-page office hours. */
export function NewsletterContactCard() {
  const { control, formState: { errors } } = useFormContext<WebsiteFormValues>();
  return (
    <SettingsCard icon={<Mail className="h-5 w-5" />} title="Newsletter & contact" description="Email sign-up on the home page and footer; office hours on the Contact page." tone="orange">
      <Controller
        control={control}
        name="newsletter.enabled"
        render={({ field }) => <SettingToggleRow id="web-news-enabled" title="Show the newsletter sign-up" description="Home page section and footer form. Subscribers appear in the Subscribers tab." checked={field.value} onChange={field.onChange} />}
      />
      <SettingsRow label="Newsletter title" htmlFor="web-news-title">
        <LengthField name="newsletter.title" id="web-news-title" max={WEBSITE_LIMITS.newsTitle} placeholder="Get new courses & offers first" error={errors.newsletter?.title?.message} />
      </SettingsRow>
      <SettingsRow label="Newsletter text" htmlFor="web-news-text">
        <LengthField name="newsletter.text" id="web-news-text" rows={2} max={WEBSITE_LIMITS.newsText} placeholder="One short email a month. No spam, unsubscribe anytime." error={errors.newsletter?.text?.message} />
      </SettingsRow>
      <SettingsRow label="Office hours" description={undefined} htmlFor="web-office-hours">
        <LengthField name="officeHours" id="web-office-hours" max={WEBSITE_LIMITS.officeHours} placeholder="Saturday – Thursday, 10:00 AM – 7:00 PM" error={errors.officeHours?.message} leftElement={<Clock className="h-4 w-4" />} />
        <p className="mt-2 body-xsm-regular text-primary-300">
          Email, phone and address come from{" "}
          <Link href="/settings" className="text-brand-orange hover:underline">
            Settings › General
          </Link>
          .
        </p>
      </SettingsRow>
    </SettingsCard>
  );
}

export default NewsletterContactCard;
