"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import type { Institution, Plan } from "@/types/saas";
import { cancelSubscription, reactivateSubscription, updatePaymentMethod } from "@/lib/saasStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { errorMessage, formatBillingDate } from "../shared/billingFormat";
import { CurrentPlanCard } from "./CurrentPlanCard";
import { UsageMetersCard } from "./UsageMetersCard";
import { IncludedFeaturesCard } from "./IncludedFeaturesCard";
import { PaymentMethodModal } from "./PaymentMethodModal";
import type { PaymentMethodFormValues } from "@/validations/saasSchema";

export interface OverviewTabProps {
  institution: Institution;
  plan: Plan | null;
  plans: Plan[];
  onGoToPlans: () => void;
}

/** Current plan + payment method, usage meters and included features. */
export function OverviewTab({ institution, plan, plans, onGoToPlans }: OverviewTabProps) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [atPeriodEnd, setAtPeriodEnd] = useState(true);
  const [isReactivating, setIsReactivating] = useState(false);
  const s = institution.subscription;
  const periodEndAllowed = s.status === "ACTIVE";

  const savePayment = async (values: PaymentMethodFormValues) => {
    const id = toast.loading("Saving payment method...", { description: `${values.brand} •••• ${values.last4}` });
    try {
      await updatePaymentMethod(institution.id, values);
      toast.success("Payment method updated", { id, description: `Future charges go to ${values.brand} •••• ${values.last4}.` });
    } catch (err) {
      toast.error("Couldn't update payment method", { id, description: errorMessage(err) });
      throw err;
    }
  };

  const cancel = async () => {
    const endAtPeriod = periodEndAllowed && atPeriodEnd;
    const id = toast.loading("Cancelling subscription...", { description: plan?.name });
    try {
      await cancelSubscription(institution.id, endAtPeriod);
      toast.success(endAtPeriod ? "Cancellation scheduled" : "Subscription cancelled", {
        id,
        description: endAtPeriod ? `You keep access until ${formatBillingDate(s.currentPeriodEnd)}.` : "Your subscription has ended.",
      });
    } catch (err) {
      toast.error("Couldn't cancel subscription", { id, description: errorMessage(err) });
      throw err;
    }
  };

  const reactivate = async () => {
    setIsReactivating(true);
    const id = toast.loading("Reactivating subscription...");
    try {
      await reactivateSubscription(institution.id);
      toast.success("Subscription reactivated", { id, description: `${plan?.name ?? "Your"} plan will renew as normal.` });
    } catch (err) {
      toast.error("Couldn't reactivate", { id, description: errorMessage(err) });
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="space-y-5">
      <CurrentPlanCard
        institution={institution}
        plan={plan}
        onChangePlan={onGoToPlans}
        onUpdatePayment={() => setPaymentOpen(true)}
        onCancel={() => {
          setAtPeriodEnd(periodEndAllowed);
          setCancelOpen(true);
        }}
        onReactivate={reactivate}
        isReactivating={isReactivating}
      />
      <UsageMetersCard institution={institution} plan={plan} onUpgrade={onGoToPlans} />
      <IncludedFeaturesCard plan={plan} plans={plans} onUpgrade={onGoToPlans} />

      {paymentOpen && <PaymentMethodModal isOpen current={s.paymentMethod} onClose={() => setPaymentOpen(false)} onSubmit={savePayment} />}

      <ConfirmModal
        isOpen={cancelOpen}
        title="Cancel subscription?"
        subtitle={periodEndAllowed ? "Choose when the cancellation takes effect." : "This ends your access immediately."}
        message={
          <div className="space-y-3">
            <p>
              {plan?.name ?? "Your"} plan features, courses and student access stop when the subscription ends. Your data is kept for 30 days in case you come back.
            </p>
            {periodEndAllowed && (
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-white p-2.5 select-none">
                <input type="checkbox" className="mt-0.5 h-4 w-4 cursor-pointer accent-brand-orange" checked={atPeriodEnd} onChange={(e) => setAtPeriodEnd(e.target.checked)} />
                <span className="body-sm-regular text-primary-500">
                  Cancel at the end of the billing period
                  <span className="block body-xsm-regular text-primary-300">Keep full access until {formatBillingDate(s.currentPeriodEnd)}. Uncheck to cancel immediately.</span>
                </span>
              </label>
            )}
          </div>
        }
        confirmLabel={periodEndAllowed && atPeriodEnd ? "Schedule cancellation" : "Cancel now"}
        pendingLabel="Cancelling..."
        confirmIcon={<XCircle className="h-4 w-4" />}
        onClose={() => setCancelOpen(false)}
        onConfirm={cancel}
      />
    </div>
  );
}

export default OverviewTab;
