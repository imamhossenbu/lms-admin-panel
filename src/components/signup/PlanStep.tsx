"use client";

import React from "react";
import { WEBSITE_URL } from "@/lib/website";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import type { BillingCycle, Plan } from "@/types/saas";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { formatUsd, monthlyEquivalent, planPrice, yearlySavingsPct } from "@/components/billing/shared/billingFormat";
import { formatLimit, LIMIT_META } from "@/lib/planAccess";
import type { SignupDraft } from "./signupSteps";

export interface PlanStepProps {
  plans: Plan[];
}

/** Step 3 — monthly/yearly switch, selectable plan rows and terms checkbox. */
export function PlanStep({ plans }: PlanStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<SignupDraft>();
  const cycle = useWatch({ control, name: "cycle" });
  const save = yearlySavingsPct(plans);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Controller
          control={control}
          name="cycle"
          render={({ field }) => (
            <SegmentedControl<BillingCycle>
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "MONTHLY", label: "Monthly" },
                { value: "YEARLY", label: "Yearly" },
              ]}
            />
          )}
        />
        {save > 0 && (
          <ToneBadge tone="green" variant="pill" size="sm">
            Save {save}% with yearly
          </ToneBadge>
        )}
      </div>

      <Controller
        control={control}
        name="planId"
        render={({ field }) => (
          <div role="radiogroup" aria-label="Plan" className="space-y-2.5">
            {plans.map((plan, i) => {
              const checked = field.value === plan.id;
              return (
                <motion.button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => field.onChange(plan.id)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    checked ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:border-primary-300/40"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", checked ? "border-brand-orange bg-brand-orange text-white" : "border-dash bg-white")}>
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="body-md-medium font-semibold! text-primary-500">{plan.name}</span>
                      {plan.highlighted && (
                        <ToneBadge tone="orange" size="sm" variant="pill">
                          Most popular
                        </ToneBadge>
                      )}
                    </span>
                    <span className="mt-0.5 block body-xsm-regular text-primary-300">{plan.tagline}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {(["students", "courses", "teamMembers"] as const).map((k) => (
                        <ToneBadge key={k} tone="gray" size="sm">
                          {formatLimit(plan.limits[k])} {LIMIT_META[k].label.toLowerCase()}
                        </ToneBadge>
                      ))}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block heading-h6 text-primary-500">
                      {formatUsd(monthlyEquivalent(plan, cycle))}
                      <span className="body-xsm-regular text-primary-300">/mo</span>
                    </span>
                    {cycle === "YEARLY" && <span className="block body-2xsm-regular text-primary-300">{formatUsd(planPrice(plan, cycle))} billed yearly</span>}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      />
      {errors.planId && <p className="body-xsm-regular text-red">{errors.planId.message}</p>}

      <div className="flex items-start gap-3 rounded-xl border border-green/30 bg-green-bg p-3.5">
        <Gift className="mt-0.5 h-5 w-5 shrink-0 text-green" />
        <div>
          <p className="body-sm-medium text-green">Start 14-day free trial — no card required</p>
          <p className="mt-0.5 body-xsm-regular text-primary-400">Every feature of the plan you pick is unlocked during the trial. Cancel any time.</p>
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 select-none">
          <input type="checkbox" className="mt-0.5 h-4 w-4 cursor-pointer rounded border-dash accent-brand-orange" {...register("agreeTerms")} />
          <span className="body-sm-regular text-primary-400">
            I agree to the{" "}
            <a href={`${WEBSITE_URL}/terms`} target="_blank" rel="noopener noreferrer" className="body-sm-medium text-brand-orange hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href={`${WEBSITE_URL}/privacy`} target="_blank" rel="noopener noreferrer" className="body-sm-medium text-brand-orange hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.agreeTerms && <p className="mt-1.5 body-xsm-regular text-red">{errors.agreeTerms.message}</p>}
      </div>
    </div>
  );
}

export default PlanStep;
