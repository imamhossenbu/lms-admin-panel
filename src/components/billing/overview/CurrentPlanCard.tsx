"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, CreditCard, Gem, Pencil, RotateCcw, XCircle } from "lucide-react";
import type { Institution, Plan } from "@/types/saas";
import { subscriptionPrice, trialDaysLeft } from "@/lib/saasStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { cycleLabel, cycleSuffix, formatBillingDate, formatUsd, SUBSCRIPTION_STATUS_META } from "../shared/billingFormat";

export interface CurrentPlanCardProps {
  institution: Institution;
  plan: Plan | null;
  onChangePlan: () => void;
  onUpdatePayment: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  isReactivating: boolean;
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="body-xsm-regular text-primary-300">{label}</p>
      <div className="mt-1 truncate body-sm-medium text-primary-500">{children}</div>
    </div>
  );
}

/** Plan name, price per cycle, renewal / trial dates, payment method and lifecycle actions. */
export function CurrentPlanCard({ institution, plan, onChangePlan, onUpdatePayment, onCancel, onReactivate, isReactivating }: CurrentPlanCardProps) {
  const s = institution.subscription;
  const price = plan ? subscriptionPrice([plan], institution) : 0;
  const days = trialDaysLeft(institution);
  const status = SUBSCRIPTION_STATUS_META[s.status];
  const pm = s.paymentMethod;
  const canCancel = (s.status === "ACTIVE" || s.status === "TRIALING" || s.status === "PAST_DUE") && !s.cancelAtPeriodEnd;
  const canReactivate = s.cancelAtPeriodEnd || s.status === "CANCELLED";

  const renewalLabel =
    s.status === "TRIALING" ? "Trial ends" : s.status === "CANCELLED" ? "Cancelled on" : s.cancelAtPeriodEnd ? "Access ends" : "Next renewal";
  const renewalDate = s.status === "TRIALING" ? s.trialEndsAt : s.status === "CANCELLED" ? s.cancelledAt ?? s.currentPeriodEnd : s.currentPeriodEnd;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="dashboard-card shadow-2xs p-5 xl:col-span-2"
      >
        <header className="flex flex-wrap items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
            <Gem className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="heading-h6 text-primary-500">{plan?.name ?? "Unknown"} plan</h2>
              <ToneBadge tone={status.tone} size="sm" variant="pill" dot>
                {s.cancelAtPeriodEnd ? "Cancels at period end" : status.label}
              </ToneBadge>
            </div>
            <p className="mt-0.5 body-sm-regular text-primary-300">{plan?.tagline}</p>
          </div>
          <PrimaryButton size="sm" leftIcon={<ArrowUpRight />} onClick={onChangePlan}>
            {s.status === "TRIALING" ? "Choose a plan" : "Change plan"}
          </PrimaryButton>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-dash pt-4 md:grid-cols-4">
          <Fact label="Price">
            {price > 0 ? (
              <>
                {formatUsd(price)}
                <span className="body-xsm-regular text-primary-300">{cycleSuffix(s.cycle)}</span>
              </>
            ) : (
              "Custom"
            )}
          </Fact>
          <Fact label="Billing cycle">{cycleLabel(s.cycle)}</Fact>
          <Fact label={renewalLabel}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 shrink-0 text-primary-300" />
              {formatBillingDate(renewalDate)}
            </span>
          </Fact>
          <Fact label="Customer since">{formatBillingDate(s.startedAt)}</Fact>
        </div>

        {s.status === "TRIALING" && days !== null && (
          <p className="mt-4 rounded-xl border border-blue/30 bg-blue-14 px-4 py-3 body-sm-regular text-primary-400">
            <span className="body-sm-medium text-blue">{days <= 0 ? "Your trial ends today." : `${days} day${days === 1 ? "" : "s"} left in your trial.`}</span> Choose a plan before it ends to keep every course,
            student and setting.
          </p>
        )}
        {s.cancelAtPeriodEnd && (
          <p className="mt-4 rounded-xl border border-yellow/30 bg-yellow-bg px-4 py-3 body-sm-regular text-primary-400">
            <span className="body-sm-medium text-yellow">Cancellation scheduled.</span> You keep full access until {formatBillingDate(s.currentPeriodEnd)}. Reactivate any time before then.
          </p>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        className="dashboard-card shadow-2xs flex flex-col p-5"
      >
        <h3 className="body-md-medium font-semibold! text-primary-500">Payment method</h3>
        <p className="mt-0.5 body-xsm-regular text-primary-300">Charged automatically at each renewal.</p>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dash bg-gray-bg p-3.5">
          <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-dash bg-white text-primary-400">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            {pm ? (
              <>
                <p className="truncate body-sm-medium text-primary-500">
                  {pm.brand} •••• {pm.last4}
                </p>
                <p className="body-xsm-regular text-primary-300">Default method</p>
              </>
            ) : (
              <>
                <p className="body-sm-medium text-primary-500">No payment method</p>
                <p className="body-xsm-regular text-primary-300">Add one before your trial ends</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <CardActionButton icon={<Pencil />} onClick={onUpdatePayment}>
            {pm ? "Update" : "Add method"}
          </CardActionButton>
          {canReactivate ? (
            <PrimaryButton size="sm" leftIcon={<RotateCcw />} onClick={onReactivate} isLoading={isReactivating} className="ml-auto">
              {isReactivating ? "Reactivating..." : "Reactivate"}
            </PrimaryButton>
          ) : canCancel ? (
            <CardActionButton icon={<XCircle />} onClick={onCancel} className="ml-auto">
              Cancel subscription
            </CardActionButton>
          ) : null}
        </div>
      </motion.section>
    </div>
  );
}

export default CurrentPlanCard;
