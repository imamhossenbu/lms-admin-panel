"use client";

import React, { Suspense } from "react";
import { BillingView } from "@/components/billing/BillingView";
import { BillingSkeleton } from "@/components/billing/BillingSkeleton";

/** Billing & Plan (`?tab=overview|plans|invoices`, `?cycle=` survive reloads). */
export default function BillingPage() {
  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingView />
    </Suspense>
  );
}
