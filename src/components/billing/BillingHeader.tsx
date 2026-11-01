"use client";

import React from "react";
import type { Institution, Plan } from "@/types/saas";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PLAN_TONE, SUBSCRIPTION_STATUS_META } from "./shared/billingFormat";

export interface BillingHeaderProps {
  institution: Institution;
  plan: Plan | null;
}

/** 🏠 › Billing & Plan, title + current plan and subscription status badges. */
export function BillingHeader({ institution, plan }: BillingHeaderProps) {
  const s = institution.subscription;
  const status = SUBSCRIPTION_STATUS_META[s.status];
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Billing & Plan" }]}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">Billing &amp; Plan</span>}
      badge={
        <span className="flex items-center gap-2">
          {plan && (
            <ToneBadge tone={PLAN_TONE[plan.id]} size="sm">
              {plan.name} plan
            </ToneBadge>
          )}
          <ToneBadge tone={status.tone} size="sm" variant="pill" dot>
            {s.cancelAtPeriodEnd ? "Cancelling" : status.label}
          </ToneBadge>
        </span>
      }
      subtitle={`Manage ${institution.name}'s subscription, usage, payment method and invoices.`}
    />
  );
}

export default BillingHeader;
