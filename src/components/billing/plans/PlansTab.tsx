"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import type { BillingCycle, Institution, Plan } from "@/types/saas";
import { changePlan, convertTrial } from "@/lib/saasStorage";
import { planRank, sortPlans } from "@/lib/saasStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { PaymentMethodFormValues } from "@/validations/saasSchema";
import { cycleLabel, errorMessage, isCustomPriced, yearlySavingsPct } from "../shared/billingFormat";
import { PaymentMethodModal } from "../overview/PaymentMethodModal";
import { PricingCard, type PlanRelation } from "./PricingCard";
import { PlanChangeModal } from "./PlanChangeModal";
import { ContactSalesModal } from "./ContactSalesModal";
import { FeatureComparisonTable } from "./FeatureComparisonTable";

export interface PlansTabProps {
  institution: Institution;
  plans: Plan[];
}

/** Pricing cards with a monthly/yearly switch (`?cycle=`), change-plan confirm, contact sales and the comparison table. */
export function PlansTab({ institution, plans }: PlansTabProps) {
  const { get, set } = useUrlParams();
  const s = institution.subscription;
  const cycleParam = get("cycle");
  const cycle: BillingCycle = cycleParam === "yearly" ? "YEARLY" : cycleParam === "monthly" ? "MONTHLY" : s.cycle;
  const [target, setTarget] = useState<Plan | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [cardFor, setCardFor] = useState<Plan | null>(null);

  // Current plan stays visible even if archived; other archived plans are hidden.
  const visible = sortPlans(plans).filter((p) => (p.isPublic && !p.archived) || p.id === s.planId || isCustomPriced(p));
  const save = yearlySavingsPct(plans);

  const relationOf = (plan: Plan): PlanRelation => {
    if (plan.id === s.planId) return "current";
    if (isCustomPriced(plan)) return "contact";
    return planRank(plans, plan.id) > planRank(plans, s.planId) ? "upgrade" : "downgrade";
  };

  const apply = async (plan: Plan) => {
    if (s.status === "TRIALING") {
      if (!s.paymentMethod) {
        setCardFor(plan);
        return;
      }
      const id = toast.loading(`Starting ${plan.name}...`, { description: `${cycleLabel(cycle)} billing` });
      try {
        await convertTrial(institution.id, plan.id, cycle, s.paymentMethod);
        toast.success(`Welcome to ${plan.name}!`, { id, description: "Your trial has been converted to a paid subscription." });
      } catch (err) {
        toast.error("Couldn't start your subscription", { id, description: errorMessage(err) });
        throw err;
      }
      return;
    }
    const id = toast.loading("Updating your plan...", { description: `${plan.name} · ${cycleLabel(cycle)}` });
    try {
      const res = await changePlan(institution.id, plan.id, cycle);
      const title = res.kind === "UPGRADE" ? `Upgraded to ${plan.name}` : res.kind === "DOWNGRADE" ? `Moved to ${plan.name}` : `Switched to ${cycleLabel(cycle).toLowerCase()} billing`;
      toast.success(title, { id, description: res.invoice ? `Invoice ${res.invoice.number} was created for the prorated amount.` : "No charge today." });
    } catch (err) {
      toast.error("Plan change blocked", { id, description: errorMessage(err) });
      throw err;
    }
  };

  const addCardAndConvert = async (values: PaymentMethodFormValues) => {
    if (!cardFor) return;
    const plan = cardFor;
    const id = toast.loading(`Starting ${plan.name}...`, { description: `Charging ${values.brand} •••• ${values.last4}` });
    try {
      await convertTrial(institution.id, plan.id, cycle, values);
      toast.success(`Welcome to ${plan.name}!`, { id, description: "Your trial has been converted to a paid subscription." });
    } catch (err) {
      toast.error("Couldn't start your subscription", { id, description: errorMessage(err) });
      throw err;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="heading-h6 text-primary-500">Choose the right plan</h2>
          <p className="body-sm-regular text-primary-300">Upgrade any time — you only pay the prorated difference.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <SegmentedControl<BillingCycle>
            value={cycle}
            onChange={(c) => set({ cycle: c === s.cycle ? null : c.toLowerCase() })}
            options={[
              { value: "MONTHLY", label: "Monthly" },
              { value: "YEARLY", label: "Yearly" },
            ]}
          />
          {save > 0 && (
            <ToneBadge tone="green" variant="pill" size="sm">
              Save {save}%
            </ToneBadge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visible.map((plan, i) => {
          const relation = relationOf(plan);
          return (
            <PricingCard
              key={plan.id}
              index={i}
              plan={plan}
              cycle={cycle}
              relation={relation}
              cycleSwitch={relation === "current" && cycle !== s.cycle && s.status !== "TRIALING"}
              onSelect={() => (relation === "contact" ? setContactOpen(true) : setTarget(plan))}
            />
          );
        })}
      </div>

      <FeatureComparisonTable plans={visible} currentPlanId={s.planId} />

      {target && <PlanChangeModal institution={institution} plans={plans} target={target} cycle={cycle} onClose={() => setTarget(null)} onConfirm={() => apply(target)} />}
      {cardFor && <PaymentMethodModal isOpen current={null} onClose={() => setCardFor(null)} onSubmit={addCardAndConvert} />}
      <ContactSalesModal isOpen={contactOpen} onClose={() => setContactOpen(false)} defaultName={institution.ownerName} defaultEmail={institution.ownerEmail} />
    </div>
  );
}

export default PlansTab;
