"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrentInstitution, useCurrentPlan, useSaasReady, useSaasStore } from "@/lib/planAccess";
import { useUrlParams } from "@/lib/useUrlParams";
import { PillTabs } from "@/components/ui/PillTabs";
import { BillingHeader } from "./BillingHeader";
import { BillingSkeleton } from "./BillingSkeleton";
import { BILLING_TABS, parseBillingTab, type BillingTab } from "./billingTabs";
import { OverviewTab } from "./overview/OverviewTab";
import { PlansTab } from "./plans/PlansTab";
import { InvoicesTab } from "./invoices/InvoicesTab";

/** /billing — header, capsule tabs (`?tab=overview|plans|invoices`, survives reloads) and the active tab. Render inside <Suspense>. */
export function BillingView() {
  const { get, set } = useUrlParams();
  const tab = parseBillingTab(get("tab"));
  const ready = useSaasReady();
  const store = useSaasStore();
  const institution = useCurrentInstitution();
  const plan = useCurrentPlan();

  if (!ready || !institution) return <BillingSkeleton tab={tab} />;

  const goTo = (next: BillingTab) => set({ tab: next === "overview" ? null : next, cycle: next === "plans" ? get("cycle") : null });
  const openCount = store.invoices.filter((i) => i.institutionId === institution.id && (i.status === "OPEN" || i.status === "FAILED")).length;
  const tabs = BILLING_TABS.map((t) => (t.id === "invoices" && openCount > 0 ? { ...t, count: openCount } : t));

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <BillingHeader institution={institution} plan={plan} />
      <PillTabs<BillingTab> tabs={tabs} activeId={tab} onChange={goTo} ariaLabel="Billing sections" idPrefix="billing" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`billing-panel-${tab}`}
          aria-labelledby={`billing-tab-${tab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {tab === "overview" && <OverviewTab institution={institution} plan={plan} plans={store.plans} onGoToPlans={() => goTo("plans")} />}
          {tab === "plans" && <PlansTab institution={institution} plans={store.plans} />}
          {tab === "invoices" && <InvoicesTab institution={institution} invoices={store.invoices} plans={store.plans} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default BillingView;
