"use client";

import React from "react";
import { Check, Minus, Table2 } from "lucide-react";
import { FEATURE_KEYS, LIMIT_KEYS, type FeatureKey, type LimitKey, type Plan, type PlanId } from "@/types/saas";
import { FEATURE_META, formatLimit, LIMIT_META } from "@/lib/planAccess";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";

type Row = { id: string; kind: "limit"; key: LimitKey } | { id: string; kind: "feature"; key: FeatureKey };

export interface FeatureComparisonTableProps {
  plans: Plan[];
  currentPlanId: PlanId;
}

/** Limits + features × plans grid (shared DataTable, vertical borders, fixed widths). */
export function FeatureComparisonTable({ plans, currentPlanId }: FeatureComparisonTableProps) {
  const rows: Row[] = [
    ...LIMIT_KEYS.map((key) => ({ id: `l-${key}`, kind: "limit" as const, key })),
    ...FEATURE_KEYS.map((key) => ({ id: `f-${key}`, kind: "feature" as const, key })),
  ];
  const planWidth = `${Math.floor(70 / Math.max(plans.length, 1))}%`;

  const columns: ColumnDef<Row>[] = [
    {
      key: "label",
      header: "Feature",
      width: "30%",
      render: (r) => {
        const meta = r.kind === "limit" ? LIMIT_META[r.key] : FEATURE_META[r.key];
        return (
          <div className="min-w-0">
            <p className="truncate body-sm-medium text-primary-500" title={meta.label}>
              {meta.label}
            </p>
            <p className="truncate body-xsm-regular text-primary-300" title={meta.description}>
              {meta.description}
            </p>
          </div>
        );
      },
    },
    ...plans.map<ColumnDef<Row>>((plan) => ({
      key: plan.id,
      width: planWidth,
      align: "center",
      header: (
        <span className="inline-flex items-center gap-1.5">
          {plan.name}
          {plan.id === currentPlanId && (
            <ToneBadge tone="orange" size="sm" variant="pill">
              Current
            </ToneBadge>
          )}
        </span>
      ),
      render: (r) =>
        r.kind === "limit" ? (
          <span className="block truncate body-sm-medium text-primary-500">{formatLimit(plan.limits[r.key], r.key)}</span>
        ) : plan.features.includes(r.key) ? (
          <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-green-bg text-green" aria-label="Included">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : (
          <span className="mx-auto flex h-6 w-6 items-center justify-center text-primary-300" aria-label="Not included">
            <Minus className="h-4 w-4" />
          </span>
        ),
    })),
  ];

  return (
    <IconSectionCard icon={<Table2 className="h-5 w-5" />} tone="purple" title="Compare plans" description="Limits and features side by side." bodyClassName="mt-4">
      <DataTable<Row> columns={columns} data={rows} tableClassName="table-fixed" minWidth="min-w-180" />
    </IconSectionCard>
  );
}

export default FeatureComparisonTable;
