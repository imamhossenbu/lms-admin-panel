"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ListChecks, Lock } from "lucide-react";
import { FEATURE_KEYS, type Plan } from "@/types/saas";
import { FEATURE_META, minPlanFor } from "@/lib/planAccess";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { MetaIcon } from "@/components/plan-gate/featureIcons";

export interface IncludedFeaturesCardProps {
  plan: Plan | null;
  plans: Plan[];
  onUpgrade: () => void;
}

/** Every feature with a tick (included) or a lock + the minimum plan that unlocks it. */
export function IncludedFeaturesCard({ plan, plans, onUpgrade }: IncludedFeaturesCardProps) {
  const included = plan?.features ?? [];
  return (
    <IconSectionCard
      icon={<ListChecks className="h-5 w-5" />}
      tone="green"
      title="Included features"
      description={`${included.length} of ${FEATURE_KEYS.length} features are on your plan.`}
      bodyClassName="mt-4"
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {FEATURE_KEYS.map((f, i) => {
          const on = included.includes(f);
          const meta = FEATURE_META[f];
          const min = minPlanFor(f, plans);
          return (
            <motion.li
              key={f}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={cn("flex items-center gap-3 rounded-xl border p-3", on ? "border-dash bg-white" : "border-dash bg-gray-bg")}
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", on ? "bg-green-bg text-green" : "bg-white text-primary-300")}>
                <MetaIcon name={meta.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate body-sm-medium", on ? "text-primary-500" : "text-primary-400")}>{meta.label}</p>
                <p className="truncate body-xsm-regular text-primary-300" title={meta.description}>
                  {on ? meta.description : `Available on ${min?.name ?? "a higher plan"} and above`}
                </p>
              </div>
              {on ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white" aria-label="Included">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : (
                <button type="button" onClick={onUpgrade} className="shrink-0 cursor-pointer" aria-label={`Upgrade to unlock ${meta.label}`}>
                  <ToneBadge tone="orange" size="sm" variant="pill" icon={<Lock className="h-2.5 w-2.5" />}>
                    Upgrade
                  </ToneBadge>
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>
    </IconSectionCard>
  );
}

export default IncludedFeaturesCard;
