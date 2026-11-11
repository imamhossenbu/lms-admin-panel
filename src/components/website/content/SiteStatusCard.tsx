"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, ExternalLink, LayoutTemplate } from "lucide-react";
import type { WebsiteFormValues } from "@/validations/websiteSchema";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";

/** Which optional sections the live site will show with the current (unsaved) values, plus a link to the site. */
export function SiteStatusCard({ siteUrl }: { siteUrl: string }) {
  const { control } = useFormContext<WebsiteFormValues>();
  const v = useWatch({ control }) as WebsiteFormValues;
  const rows = [
    { label: "Custom hero text", on: !!(v.hero?.title || v.hero?.subtitle), off: "Using the default headline" },
    { label: "Our mission", on: !!(v.mission?.why || v.mission?.what || v.mission?.how), off: "Hidden until you write it" },
    { label: "FAQ", on: (v.faqs?.length ?? 0) > 0, off: "Hidden — no questions" },
    { label: "Mobile app", on: !!(v.app?.appStoreUrl || v.app?.playStoreUrl), off: "Hidden — no store link" },
    { label: "Social icons", on: Object.values(v.socials ?? {}).some(Boolean), off: "Hidden — no links" },
    { label: "Newsletter", on: !!v.newsletter?.enabled, off: "Turned off" },
  ];
  return (
    <SettingsCard icon={<LayoutTemplate className="h-5 w-5" />} title="On your site" description="What visitors will see after you save." tone="green">
      <ul className="divide-y divide-dash">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="min-w-0">
              <span className="block body-sm-medium text-primary-500">{r.label}</span>
              {!r.on && <span className="block body-xsm-regular text-primary-300">{r.off}</span>}
            </span>
            <ToneBadge tone={r.on ? "green" : "gray"} size="sm" icon={r.on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}>
              {r.on ? "Shown" : "Hidden"}
            </ToneBadge>
          </li>
        ))}
      </ul>
      <div className="p-5">
        <motion.a whileTap={{ scale: 0.97 }} href={siteUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 transition-colors hover:border-primary-300">
          <ExternalLink className="h-4 w-4" />
          View live site
        </motion.a>
      </div>
    </SettingsCard>
  );
}

export default SiteStatusCard;
