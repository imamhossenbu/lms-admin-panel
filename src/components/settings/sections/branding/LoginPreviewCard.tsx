"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { MonitorSmartphone } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { BrandImage } from "./BrandImage";
import { ACCENT_STYLE, type BrandingPreviews } from "./brandingUtils";

export interface LoginPreviewCardProps {
  platformName: string;
  tagline: string;
  previews: BrandingPreviews;
}

/** Wordmark fallback when no logo is uploaded (or it can't be shown). */
function Wordmark({ name, light, accentSolid }: { name: string; light?: boolean; accentSolid: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md body-2xsm-regular font-semibold! text-white", light ? "bg-white/20" : accentSolid)}>
        {name.charAt(0).toUpperCase() || "E"}
      </span>
      <span className={cn("truncate body-xsm-medium font-semibold!", light ? "text-white" : "text-primary-500")}>{name}</span>
    </span>
  );
}

/** Live login screen mock: accent gradient / background image panel + sign-in form. */
export function LoginPreviewCard({ platformName, tagline, previews }: LoginPreviewCardProps) {
  const { control } = useFormContext<BrandingSettings>();
  const v = useWatch({ control }) as Partial<BrandingSettings>;
  const accent = ACCENT_STYLE[v.accent ?? "orange"];
  const name = platformName || "Your platform";
  const bg = previews.loginImageUrl ?? v.loginImageUrl ?? "";
  const logo = previews.logoUrl ?? v.logoUrl ?? "";
  const darkLogo = previews.logoDarkUrl ?? v.logoDarkUrl ?? "";

  return (
    <IconSectionCard
      icon={<MonitorSmartphone className="h-5 w-5" />}
      title="Live preview"
      description="Your login screen, as students will see it."
      tone="orange"
      action={
        <ToneBadge tone="green" size="sm" variant="pill" dot>
          Live
        </ToneBadge>
      }
    >
      <div className="overflow-hidden rounded-xl border border-dash bg-white shadow-xs">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-dash bg-gray-bg px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red/60" />
          <span className="h-2 w-2 rounded-full bg-yellow/60" />
          <span className="h-2 w-2 rounded-full bg-green/60" />
          <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white px-2 py-0.5 body-2xsm-regular text-primary-300">app.{name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "edupro"}.com/login</span>
        </div>

        <div className="grid grid-cols-5">
          {/* Visual panel */}
          <div className={cn("relative col-span-2 flex min-h-64 flex-col justify-between overflow-hidden p-3", accent.gradient)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={bg || v.accent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
                <BrandImage src={bg} alt="" fit="cover" className="h-full w-full" fallback={null} overlay={<span className="absolute inset-0 bg-brand-navy/40" />} />
              </motion.span>
            </AnimatePresence>
            <span className="relative">
              <BrandImage src={darkLogo} alt={`${name} logo`} className="h-5 w-20" fallback={<Wordmark name={name} light accentSolid={accent.solid} />} />
            </span>
            <span className="relative space-y-1">
              <span className="block h-1 w-6 rounded-full bg-white/70" />
              <span className="block line-clamp-3 body-2xsm-regular text-white/90">{tagline || "Learn, teach and grow — all in one place."}</span>
            </span>
          </div>

          {/* Form panel */}
          <div className="col-span-3 flex flex-col justify-center gap-2.5 p-4">
            <BrandImage src={logo} alt={`${name} logo`} className="h-5 w-20" fallback={<Wordmark name={name} accentSolid={accent.solid} />} />
            <div className="min-w-0">
              <motion.p key={v.loginHeadline} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="line-clamp-2 body-sm-medium font-semibold! text-primary-500">
                {v.loginHeadline?.trim() || "Add a headline"}
              </motion.p>
              {v.loginSubtext?.trim() && <p className="mt-0.5 line-clamp-2 body-2xsm-regular text-primary-300">{v.loginSubtext}</p>}
            </div>
            <div className="space-y-1.5">
              {["Email address", "Password"].map((label) => (
                <div key={label}>
                  <span className="block body-2xsm-regular text-primary-400">{label}</span>
                  <span className="mt-0.5 flex h-6 items-center rounded-md border border-dash bg-white px-2">
                    <span className="h-1.5 w-1/2 rounded-full bg-slate-100" />
                  </span>
                </div>
              ))}
            </div>
            <motion.span layout className={cn("flex h-7 items-center justify-center rounded-md body-2xsm-regular font-semibold! text-white transition-colors", accent.solid)}>
              Sign in
            </motion.span>
            <span className={cn("text-center body-2xsm-regular", accent.text)}>Forgot password?</span>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between gap-2 border-t border-dash bg-gray-bg px-3 py-1.5">
          <span className="truncate body-2xsm-regular text-primary-300">{v.footerText?.trim() || "Footer text"}</span>
          <AnimatePresence initial={false}>
            {v.showPoweredBy && (
              <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 4 }} className="shrink-0 whitespace-nowrap body-2xsm-regular text-primary-300">
                Powered by <span className="font-semibold! text-brand-orange">EduPro</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default LoginPreviewCard;
