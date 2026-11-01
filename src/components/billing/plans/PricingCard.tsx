"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, Headset } from "lucide-react";
import type { BillingCycle, Plan } from "@/types/saas";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FEATURE_META, formatLimit, LIMIT_META } from "@/lib/planAccess";
import { cn } from "@/lib/cn";
import { formatUsd, isCustomPriced, monthlyEquivalent, planPrice } from "../shared/billingFormat";

export type PlanRelation = "current" | "upgrade" | "downgrade" | "contact";

export interface PricingCardProps {
  plan: Plan;
  cycle: BillingCycle;
  relation: PlanRelation;
  /** Current plan but a different billing cycle — offer switching cycle. */
  cycleSwitch?: boolean;
  onSelect: () => void;
  index?: number;
}

/** One plan column: name, tagline, price for the cycle, limits, features and the action button. */
export function PricingCard({ plan, cycle, relation, cycleSwitch, onSelect, index = 0 }: PricingCardProps) {
  const custom = isCustomPriced(plan);
  const isCurrent = relation === "current";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-2xs",
        isCurrent ? "border-brand-orange" : plan.highlighted ? "border-blue" : "border-dash"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="heading-h6 text-primary-500">{plan.name}</h3>
        {isCurrent ? (
          <ToneBadge tone="orange" size="sm" variant="pill" dot>
            Current plan
          </ToneBadge>
        ) : plan.highlighted ? (
          <ToneBadge tone="blue" size="sm" variant="pill">
            Most popular
          </ToneBadge>
        ) : null}
      </div>
      <p className="mt-1 min-h-10 body-xsm-regular text-primary-300">{plan.tagline}</p>

      <div className="mt-4">
        {custom ? (
          <p className="heading-h4 text-primary-500">Custom</p>
        ) : (
          <p className="text-primary-500">
            <span className="heading-h3">{formatUsd(monthlyEquivalent(plan, cycle))}</span>
            <span className="body-sm-regular text-primary-300"> /month</span>
          </p>
        )}
        <p className="mt-0.5 body-xsm-regular text-primary-300">
          {custom ? "Tailored pricing & contract" : cycle === "YEARLY" ? `${formatUsd(planPrice(plan, cycle))} billed yearly` : "Billed monthly"}
        </p>
      </div>

      <div className="mt-4">
        {relation === "contact" ? (
          <SecondaryButton fullWidth leftIcon={<Headset />} onClick={onSelect}>
            Contact sales
          </SecondaryButton>
        ) : isCurrent ? (
          cycleSwitch ? (
            <SecondaryButton fullWidth onClick={onSelect}>
              Switch to {cycle === "YEARLY" ? "yearly" : "monthly"}
            </SecondaryButton>
          ) : (
            <SecondaryButton fullWidth disabled>
              Your current plan
            </SecondaryButton>
          )
        ) : relation === "upgrade" ? (
          <PrimaryButton fullWidth leftIcon={<ArrowUpRight />} onClick={onSelect}>
            Upgrade to {plan.name}
          </PrimaryButton>
        ) : (
          <SecondaryButton fullWidth leftIcon={<ArrowDownRight />} onClick={onSelect}>
            Downgrade to {plan.name}
          </SecondaryButton>
        )}
      </div>

      <div className="mt-5 space-y-2 border-t border-dash pt-4">
        {(Object.keys(LIMIT_META) as (keyof typeof LIMIT_META)[]).map((k) => (
          <p key={k} className="flex items-center justify-between gap-2 body-xsm-regular text-primary-400">
            <span>{LIMIT_META[k].label}</span>
            <span className="body-xsm-medium text-primary-500">{formatLimit(plan.limits[k], k)}</span>
          </p>
        ))}
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-dash pt-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 body-xsm-regular text-primary-400">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" strokeWidth={3} />
            {FEATURE_META[f].label}
          </li>
        ))}
        {plan.features.length === 0 && <li className="body-xsm-regular text-primary-300">Core LMS features</li>}
      </ul>
    </motion.article>
  );
}

export default PricingCard;
