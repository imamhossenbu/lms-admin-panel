"use client";

import React from "react";
import { Gauge } from "lucide-react";
import { LIMIT_KEYS, type Institution, type Plan } from "@/types/saas";
import { LIMIT_META, limitFor } from "@/lib/planAccess";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { MetaIcon } from "@/components/plan-gate/featureIcons";
import { UsageMeter } from "./UsageMeter";

export interface UsageMetersCardProps {
  institution: Institution;
  plan: Plan | null;
  onUpgrade: () => void;
}

/** One meter per plan limit (students, courses, team members, storage). */
export function UsageMetersCard({ institution, plan, onUpgrade }: UsageMetersCardProps) {
  return (
    <IconSectionCard icon={<Gauge className="h-5 w-5" />} tone="blue" title="Usage" description="How much of your plan you're using right now." bodyClassName="mt-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LIMIT_KEYS.map((key, i) => (
          <UsageMeter
            key={key}
            index={i}
            label={LIMIT_META[key].label}
            icon={<MetaIcon name={LIMIT_META[key].icon} />}
            used={institution.usage[key]}
            limit={limitFor(plan, key)}
            format={key === "storageGb" ? (n) => `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })} GB` : undefined}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>
    </IconSectionCard>
  );
}

export default UsageMetersCard;
