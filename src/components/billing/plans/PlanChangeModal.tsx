"use client";

import React, { useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Info, RefreshCw } from "lucide-react";
import type { BillingCycle, Institution, Plan } from "@/types/saas";
import { planChangePreview } from "@/lib/saasStats";
import { formatLimit, LIMIT_META } from "@/lib/planAccess";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cycleLabel, cycleSuffix, formatBillingDate, formatUsd } from "../shared/billingFormat";

export interface PlanChangeModalProps {
  institution: Institution;
  plans: Plan[];
  target: Plan;
  cycle: BillingCycle;
  onClose: () => void;
  /** Resolve to close; throw to keep it open (caller toasts the Error message). */
  onConfirm: () => Promise<void>;
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="body-sm-regular text-primary-400">{label}</span>
      <span className={strong ? "body-md-medium font-semibold! text-primary-500" : "body-sm-medium text-primary-500"}>{value}</span>
    </div>
  );
}

/** Confirm an upgrade / downgrade / cycle switch: price difference, proration and downgrade blockers. */
export function PlanChangeModal({ institution, plans, target, cycle, onClose, onConfirm }: PlanChangeModalProps) {
  const [pending, setPending] = useState(false);
  const s = institution.subscription;
  const current = plans.find((p) => p.id === s.planId);
  const preview = planChangePreview(plans, institution, target.id, cycle);
  const blocked = preview.blockers.length > 0;
  const trialing = preview.trialing;
  const needsCard = trialing && !s.paymentMethod;

  const kindMeta = {
    UPGRADE: { title: `Upgrade to ${target.name}`, icon: <ArrowUpRight className="text-brand-orange" />, cta: "Confirm upgrade" },
    DOWNGRADE: { title: `Downgrade to ${target.name}`, icon: <ArrowDownRight className="text-primary-400" />, cta: "Confirm downgrade" },
    CYCLE: { title: `Switch to ${cycleLabel(cycle).toLowerCase()} billing`, icon: <RefreshCw className="text-blue" />, cta: "Switch billing" },
    SAME: { title: `${target.name}`, icon: <Info className="text-primary-400" />, cta: "Close" },
  }[preview.kind];

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      /* caller toasts */
    } finally {
      setPending(false);
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={pending ? () => {} : onClose}
      title={trialing ? `Start the ${target.name} plan` : kindMeta.title}
      subtitle={trialing ? "Your trial converts to a paid subscription today." : "Review the change before confirming."}
      titleIcon={kindMeta.icon}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={pending}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={confirm} isLoading={pending} disabled={blocked || preview.kind === "SAME"}>
            {pending ? "Applying..." : needsCard ? "Add payment method" : trialing ? `Start ${target.name}` : kindMeta.cta}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-dash bg-gray-bg p-4">
          <div className="min-w-0 text-center">
            <p className="body-xsm-regular text-primary-300">Current</p>
            <p className="truncate body-md-medium font-semibold! text-primary-500">{current?.name ?? s.planId}</p>
            <p className="body-xsm-regular text-primary-300">
              {preview.currentPrice > 0 ? `${formatUsd(preview.currentPrice)}${cycleSuffix(s.cycle)}` : trialing ? "Free trial" : "Custom"}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary-300" />
          <div className="min-w-0 text-center">
            <p className="body-xsm-regular text-primary-300">New</p>
            <p className="truncate body-md-medium font-semibold! text-brand-orange">{target.name}</p>
            <p className="body-xsm-regular text-primary-300">{preview.nextPrice > 0 ? `${formatUsd(preview.nextPrice)}${cycleSuffix(cycle)}` : "Custom"}</p>
          </div>
        </div>

        {blocked ? (
          <div className="rounded-xl border border-red/30 bg-red-14 p-4">
            <p className="flex items-center gap-2 body-sm-medium text-red-dark">
              <AlertTriangle className="h-4 w-4 shrink-0" /> You&apos;re using more than {target.name} allows
            </p>
            <p className="mt-1 body-xsm-regular text-primary-400">Reduce usage below these limits, then try again:</p>
            <ul className="mt-3 space-y-2">
              {preview.blockers.map((b) => (
                <li key={b.key} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                  <span className="body-sm-medium text-primary-500">{LIMIT_META[b.key].label}</span>
                  <ToneBadge tone="red" size="sm">
                    {formatLimit(b.usage, b.key)} used / {formatLimit(b.limit, b.key)} allowed
                  </ToneBadge>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="divide-y divide-dash rounded-xl border border-dash px-4">
            <Row label={`${target.name} price`} value={preview.nextPrice > 0 ? `${formatUsd(preview.nextPrice)}${cycleSuffix(cycle)}` : "Custom"} />
            {!trialing && (
              <Row
                label="Difference per month"
                value={`${preview.nextMonthly - preview.currentMonthly >= 0 ? "+" : "−"}${formatUsd(Math.abs(Math.round((preview.nextMonthly - preview.currentMonthly) * 100) / 100))}`}
              />
            )}
            {!trialing && preview.credit > 0 && preview.resetsPeriod && <Row label="Unused credit applied" value={`−${formatUsd(preview.credit)}`} />}
            <Row label="Due today" value={formatUsd(trialing ? preview.nextPrice : preview.dueNow)} strong />
          </div>
        )}

        {!blocked && (
          <p className="flex items-start gap-2 rounded-xl border border-blue/30 bg-blue-14 px-3.5 py-3 body-xsm-regular text-primary-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
            <span>
              {trialing
                ? needsCard
                  ? "Add a payment method to start your subscription. You'll be charged today and every period after."
                  : `We'll charge ${s.paymentMethod?.brand} •••• ${s.paymentMethod?.last4} today. Your trial ends now and a new ${cycleLabel(cycle).toLowerCase()} period starts.`
                : preview.resetsPeriod
                  ? `Switching billing cycle starts a new period today; the unused part of your current period is credited.`
                  : preview.kind === "UPGRADE"
                    ? `Prorated: you pay only the difference for the rest of this period (until ${formatBillingDate(s.currentPeriodEnd)}). New features unlock immediately.`
                    : `Downgrades apply immediately. There's no refund for the current period; your next renewal on ${formatBillingDate(s.currentPeriodEnd)} is at the lower price.`}
            </span>
          </p>
        )}
      </div>
    </ModalShell>
  );
}

export default PlanChangeModal;
