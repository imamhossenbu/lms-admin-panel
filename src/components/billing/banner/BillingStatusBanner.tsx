"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CreditCard, Sparkles, X } from "lucide-react";
import { useCurrentInstitution, useCurrentPlan } from "@/lib/planAccess";
import { trialDaysLeft } from "@/lib/saasStats";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/cn";

const DISMISS_KEY = "edupro_trial_banner_dismissed";

const readDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Strip above the navbar: TRIALING → "N days left" + Choose a plan (dismissible for this session);
 * PAST_DUE → red "Payment failed" + update payment method (not dismissible).
 */
export function BillingStatusBanner() {
  const inst = useCurrentInstitution();
  const plan = useCurrentPlan();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(readDismissed);

  const status = inst?.subscription.status;
  const onBilling = pathname?.startsWith("/billing");
  const showTrial = status === "TRIALING" && !dismissed;
  const showPastDue = status === "PAST_DUE";
  const days = inst ? trialDaysLeft(inst) : null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const trialText =
    days === null ? "Your free trial is active" : days <= 0 ? "Your free trial ends today" : `${days} day${days === 1 ? "" : "s"} left in your free trial`;

  return (
    <AnimatePresence initial={false}>
      {(showTrial || showPastDue) && (
        <motion.div
          key={showPastDue ? "past-due" : "trial"}
          role={showPastDue ? "alert" : "status"}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5",
              showPastDue ? "border-red/30 bg-red-14" : "border-brand-orange/20 bg-brand-orange-light"
            )}
          >
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white", showPastDue ? "text-red" : "text-brand-orange")}>
              {showPastDue ? <AlertTriangle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              {showPastDue ? (
                <>
                  <p className="body-sm-medium text-red-dark">Payment failed — update your payment method</p>
                  <p className="body-xsm-regular text-primary-400">We couldn&apos;t charge your last invoice. Update your card or bKash to avoid suspension.</p>
                </>
              ) : (
                <>
                  <p className="body-sm-medium text-primary-500">
                    {trialText} <span className="text-brand-orange">— Choose a plan</span>
                  </p>
                  <p className="body-xsm-regular text-primary-400">
                    You&apos;re trying {plan?.name ?? "EduPro"} with every feature unlocked. Pick a plan to keep your academy running.
                  </p>
                </>
              )}
            </div>
            {!onBilling && (
              <Link href={showPastDue ? "/billing" : "/billing?tab=plans"}>
                <PrimaryButton size="sm" leftIcon={showPastDue ? <CreditCard /> : undefined}>
                  {showPastDue ? "Update payment method" : "Choose a plan"}
                </PrimaryButton>
              </Link>
            )}
            {showTrial && !showPastDue && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={dismiss}
                aria-label="Dismiss trial banner"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-white hover:text-primary-500"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BillingStatusBanner;
