"use client";

import React from "react";
import type { FeatureKey } from "@/types/saas";
import { useFeatureAccess } from "@/lib/planAccess";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { UpgradeLockCard } from "./UpgradeLockCard";

export interface PlanGateProps {
  /** null = not gated (children always render) — handy inside lists where only some items need a feature. */
  feature: FeatureKey | null;
  children: React.ReactNode;
  /** Replaces the default UpgradeLockCard when the feature is locked. */
  fallback?: React.ReactNode;
  /** Rendered while the SaaS store hydrates (defaults to the lock-card skeleton). */
  loading?: React.ReactNode;
  /** Use the compact card (inside grids / settings). */
  compact?: boolean;
}

/** Mirrors UpgradeLockCard while the plan is being read (never flashes gated content). */
export function PlanGateSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="dashboard-card shadow-2xs h-full animate-pulse p-5" aria-hidden>
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded-md bg-slate-200" />
            <div className="h-3 w-40 rounded-md bg-slate-100" />
          </div>
        </div>
        <div className="mt-4 h-3 w-full rounded-md bg-slate-100" />
        <div className="mt-2 h-3 w-2/3 rounded-md bg-slate-100" />
        <div className="mt-5 h-8.5 w-32 rounded-lg bg-slate-100" />
      </div>
    );
  }
  return (
    <div className="dashboard-card shadow-2xs mx-auto flex max-w-2xl animate-pulse flex-col items-center px-6 py-10" aria-hidden>
      <div className="h-16 w-16 rounded-2xl bg-slate-200" />
      <div className="mt-5 h-5 w-44 rounded-full bg-slate-100" />
      <div className="mt-3 h-6 w-72 max-w-full rounded-md bg-slate-200" />
      <div className="mt-3 h-4 w-96 max-w-full rounded-md bg-slate-100" />
      <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-dash px-3 py-2.5">
            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
            <div className="h-3 flex-1 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-7 h-10 w-36 rounded-lg bg-slate-200" />
    </div>
  );
}

/**
 * Renders children only when the current institution's plan includes `feature`; otherwise an
 * UpgradeLockCard (or `fallback`). Suspended / cancelled subscriptions count as locked.
 */
export function PlanGate({ feature, children, fallback, loading, compact = false }: PlanGateProps) {
  // Hooks can't be conditional: an ungated item reads any key and ignores the result.
  const { ready, allowed, plan, requiredPlan, meta } = useFeatureAccess(feature ?? "certificates");
  if (!feature) return <>{children}</>;
  if (!ready) return <>{loading ?? <PlanGateSkeleton compact={compact} />}</>;
  if (allowed) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  const card = <UpgradeLockCard feature={feature} requiredPlanName={requiredPlan?.name} currentPlanName={plan?.name} compact={compact} />;
  if (compact) return card;
  // Full-page lock keeps the page's breadcrumb so navigation context isn't lost.
  return (
    <div className="space-y-5 pb-8 text-left">
      <Breadcrumb items={[{ label: meta.label }]} />
      {card}
    </div>
  );
}

export default PlanGate;
