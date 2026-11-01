"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import type { GeneralSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { buildTimezoneOptions, formatDateAs, formatPrice, formatTimeAs, weekDays } from "./generalUtils";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "E";

/** "How it looks" — the name, tagline and a sample date / time / price in the chosen formats. */
export function GeneralPreviewCard() {
  const { control } = useFormContext<GeneralSettings>();
  const v = useWatch({ control }) as Partial<GeneralSettings>;
  const [now] = useState(() => new Date());
  const tz = v.timezone || "UTC";
  const name = v.platformName?.trim() || "Your platform";
  const offset = buildTimezoneOptions(tz).find((o) => o.value === tz)?.offset ?? "UTC";
  const days = weekDays(v.weekStartsOn ?? "SATURDAY");

  const rows: { label: string; value: string }[] = [
    { label: "Date", value: formatDateAs(now, v.dateFormat ?? "MMM D, YYYY", tz) },
    { label: "Time", value: `${formatTimeAs(now, v.timeFormat ?? "12h", tz)} (${offset})` },
    { label: "Course price", value: formatPrice(49.99, v.currency ?? "USD") },
  ];

  return (
    <IconSectionCard icon={<Eye className="h-5 w-5" />} title="How it looks" description="Updates as you type." tone="purple">
      <div className="overflow-hidden rounded-xl border border-dash">
        <div className="flex items-center gap-3 border-b border-dash bg-gray-bg px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange body-sm-medium font-semibold! text-white">{initials(name)}</span>
          <div className="min-w-0">
            <motion.p key={name} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="truncate body-sm-medium font-semibold! text-primary-500">
              {name}
            </motion.p>
            <p className="truncate body-xsm-regular text-primary-300">{v.tagline?.trim() || "Add a tagline to introduce your academy"}</p>
          </div>
        </div>

        <dl className="divide-y divide-dash">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <dt className="body-xsm-regular text-primary-300">{r.label}</dt>
              <dd className="truncate body-sm-medium tabular-nums text-primary-500">{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-dash px-4 py-3">
          <p className="mb-2 body-xsm-regular text-primary-300">Week view</p>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => (
              <span
                key={d}
                className={cn(
                  "flex h-7 items-center justify-center rounded-md body-2xsm-regular",
                  i === 0 ? "bg-brand-orange-light font-semibold! text-brand-orange" : "bg-gray-bg text-primary-400"
                )}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ToneBadge tone="gray" size="sm" variant="pill">
          {tz}
        </ToneBadge>
        <ToneBadge tone="gray" size="sm" variant="pill">
          {v.currency ?? "USD"}
        </ToneBadge>
        <ToneBadge tone="gray" size="sm" variant="pill">
          {v.timeFormat === "24h" ? "24-hour clock" : "12-hour clock"}
        </ToneBadge>
      </div>
    </IconSectionCard>
  );
}

export default GeneralPreviewCard;
