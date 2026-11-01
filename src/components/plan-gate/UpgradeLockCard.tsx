"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Lock } from "lucide-react";
import type { FeatureKey } from "@/types/saas";
import { FEATURE_META } from "@/lib/planAccess";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { MetaIcon } from "./featureIcons";

export interface UpgradeLockCardProps {
  feature: FeatureKey;
  /** Name of the cheapest plan that unlocks it (falls back to FEATURE_META.minPlan). */
  requiredPlanName?: string | null;
  /** Current plan name, shown as context. */
  currentPlanName?: string | null;
  /** Compact inline variant for cards inside other pages (e.g. Settings). */
  compact?: boolean;
  /** Extra reason shown instead of the default (e.g. suspended account). */
  note?: string;
  className?: string;
}

const PERKS: Partial<Record<FeatureKey, string[]>> = {
  liveClasses: ["Zoom & Google Meet scheduling", "Attendance tracking", "Cloud recordings"],
  certificates: ["Branded templates", "Automatic issuing on completion", "Public verification links"],
  community: ["Course discussion spaces", "Posts, replies & reactions", "Moderation tools"],
  advancedAnalytics: ["Revenue & cohort reports", "Engagement insights", "CSV exports"],
  customDomain: ["Your own domain", "Free automatic SSL", "Keep your edupro.com address too"],
  aiAssistant: ["AI course outlines", "Quiz generation", "Lesson drafts"],
  whiteLabel: ["Remove EduPro branding", "Your logo on emails & certificates", "Branded login page"],
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Polished "this feature isn't on your plan" card with an Upgrade CTA → /billing?tab=plans. */
export function UpgradeLockCard({ feature, requiredPlanName, currentPlanName, compact = false, note, className }: UpgradeLockCardProps) {
  const meta = FEATURE_META[feature];
  const planName = requiredPlanName ?? capitalize(meta.minPlan);
  const perks = PERKS[feature] ?? [];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn("dashboard-card shadow-2xs flex h-full flex-col p-5", className)}
      >
        <div className="flex items-start gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
            <MetaIcon name={meta.icon} className="h-5 w-5" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white">
              <Lock className="h-2.5 w-2.5" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate body-md-medium font-semibold! text-primary-500">{meta.label}</h3>
            <p className="body-xsm-regular text-primary-300">Available on {planName} and above</p>
          </div>
          <ToneBadge tone="orange" size="sm" variant="pill" icon={<Lock className="h-2.5 w-2.5" />}>
            {planName}
          </ToneBadge>
        </div>
        <p className="mt-3 flex-1 body-sm-regular text-primary-400">{note ?? meta.description}</p>
        <div className="mt-5 border-t border-dash pt-4">
          <Link href="/billing?tab=plans">
            <PrimaryButton size="sm" leftIcon={<ArrowUpRight />}>
              Upgrade plan
            </PrimaryButton>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("dashboard-card shadow-2xs mx-auto flex max-w-2xl flex-col items-center px-6 py-10 text-center sm:px-10", className)}
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.05 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange-light text-brand-orange"
      >
        <MetaIcon name={meta.icon} className="h-8 w-8" />
        <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white">
          <Lock className="h-3.5 w-3.5" />
        </span>
      </motion.span>

      <ToneBadge tone="orange" variant="pill" size="sm" className="mt-5">
        Available on {planName} and above
      </ToneBadge>
      <h2 className="mt-3 heading-h4 text-primary-500">{meta.label} is locked on your plan</h2>
      <p className="mt-2 max-w-md body-regular text-primary-300">{note ?? meta.description}</p>
      {currentPlanName && (
        <p className="mt-1 body-sm-regular text-primary-300">
          You&apos;re on the <span className="body-sm-medium text-primary-500">{currentPlanName}</span> plan.
        </p>
      )}

      {perks.length > 0 && (
        <ul className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          {perks.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-2 rounded-xl border border-dash bg-gray-bg px-3 py-2.5 text-left body-xsm-medium text-primary-400"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-green" strokeWidth={3} />
              {p}
            </motion.li>
          ))}
        </ul>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/billing?tab=plans">
          <PrimaryButton leftIcon={<ArrowUpRight />}>Upgrade plan</PrimaryButton>
        </Link>
        <Link href="/billing" className="body-sm-medium text-primary-400 transition-colors hover:text-brand-orange">
          View billing &amp; usage
        </Link>
      </div>
    </motion.section>
  );
}

export default UpgradeLockCard;
