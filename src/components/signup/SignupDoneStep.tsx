"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, ExternalLink, LogIn, Mail, RotateCcw } from "lucide-react";
import { SAAS_ROOT_DOMAIN } from "@/types/saas";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatBillingDate } from "@/components/billing/shared/billingFormat";
import type { SignupResult } from "./signupSteps";

export interface SignupDoneStepProps {
  result: SignupResult;
  onStartOver: () => void;
}

/** Step 4 — success state with the new academy URL and next actions. */
export function SignupDoneStep({ result, onStartOver }: SignupDoneStepProps) {
  const url = `${result.slug}.${SAAS_ROOT_DOMAIN}`;
  return (
    <div className="space-y-5 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-bg text-green"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>
      <div>
        <h3 className="heading-h5 text-primary-500">{result.institutionName} is ready!</h3>
        <p className="mt-1 body-sm-regular text-primary-300">
          Your {result.planName} trial has started. We&apos;ve emailed a 6-digit code to {result.email} — enter it to activate your account, then sign in.
        </p>
      </div>

      <div className="rounded-xl border border-dash bg-gray-bg p-4 text-left">
        <p className="body-xsm-medium text-primary-300">Your academy address</p>
        <div className="mt-1.5 flex items-center gap-2">
          <ExternalLink className="h-4 w-4 shrink-0 text-brand-orange" />
          <span className="min-w-0 flex-1 truncate body-md-medium font-semibold! text-primary-500" title={`https://${url}`}>
            https://{url}
          </span>
          <CopyButton value={`https://${url}`} label="Address copied" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ToneBadge tone="blue" size="sm" variant="pill" icon={<CalendarClock className="h-3 w-3" />}>
            Trial ends {formatBillingDate(result.trialEndsAt)}
          </ToneBadge>
          <ToneBadge tone="gray" size="sm" variant="pill" icon={<Mail className="h-3 w-3" />}>
            {result.email}
          </ToneBadge>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Link href={`/verify-email?email=${encodeURIComponent(result.email)}`} className="flex-1">
          <PrimaryButton fullWidth size="lg" leftIcon={<LogIn />}>
            Verify email
          </PrimaryButton>
        </Link>
        <SecondaryButton size="lg" leftIcon={<RotateCcw />} onClick={onStartOver}>
          Create another
        </SecondaryButton>
      </div>
    </div>
  );
}

export default SignupDoneStep;
