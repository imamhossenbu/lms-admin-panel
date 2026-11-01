"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Plug } from "lucide-react";
import type { IntegrationsSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { INTEGRATIONS, INTEGRATION_TILE } from "./integrationsMeta";

/** "Connected services N/5" with a progress track and per-service status. */
export function ConnectedServicesCard() {
  const { control } = useFormContext<IntegrationsSettings>();
  const values = useWatch({ control });
  const count = INTEGRATIONS.filter((i) => values[i.key]?.connected).length;
  const pct = Math.round((count / INTEGRATIONS.length) * 100);

  return (
    <IconSectionCard icon={<Plug className="h-5 w-5" />} title="Connected services" description="Third-party tools linked to your platform." tone="orange">
      <p className="flex items-baseline gap-1">
        <span className="heading-h3 font-bold! text-primary-500 tabular-nums">{count}</span>
        <span className="body-sm-regular text-primary-300">/ {INTEGRATIONS.length}</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={INTEGRATIONS.length}>
        <motion.div className="h-full rounded-full bg-brand-orange" initial={false} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
      </div>

      <ul className="mt-4 divide-y divide-dash">
        {INTEGRATIONS.map((i) => {
          const on = !!values[i.key]?.connected;
          return (
            <li key={i.key} className="flex items-center gap-3 py-2.5">
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", INTEGRATION_TILE[i.tone])}>{i.icon}</span>
              <span className="min-w-0 flex-1 truncate body-sm-regular text-primary-500">{i.name}</span>
              <ToneBadge tone={on ? "green" : "gray"} size="sm" variant="pill" dot>
                {on ? "On" : "Off"}
              </ToneBadge>
            </li>
          );
        })}
      </ul>
    </IconSectionCard>
  );
}

export default ConnectedServicesCard;
