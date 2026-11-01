"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface UsageMeterProps {
  label: string;
  icon: React.ReactNode;
  used: number;
  /** null = unlimited. */
  limit: number | null;
  /** "1,240 students" style formatter for numbers. */
  format?: (n: number) => string;
  onUpgrade?: () => void;
  index?: number;
}

/** Threshold → colours (≥100 red, ≥90 red-ish, ≥75 yellow, else green). */
function levelOf(pct: number): { bar: string; tone: Tone; note: string | null } {
  if (pct >= 100) return { bar: "bg-red", tone: "red", note: "Limit reached" };
  if (pct >= 90) return { bar: "bg-red", tone: "red", note: "Almost full" };
  if (pct >= 75) return { bar: "bg-yellow", tone: "yellow", note: "Getting close" };
  return { bar: "bg-green", tone: "green", note: null };
}

/** One plan limit: used / limit, animated % bar with 75/90/100 thresholds and an Upgrade CTA at ≥90%. */
export function UsageMeter({ label, icon, used, limit, format = (n) => n.toLocaleString("en-US"), onUpgrade, index = 0 }: UsageMeterProps) {
  const unlimited = limit === null;
  const pct = unlimited || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const level = levelOf(unlimited ? 0 : pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      className="rounded-xl border border-dash bg-white p-4"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-bg text-primary-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <p className="min-w-0 flex-1 truncate body-sm-medium text-primary-500">{label}</p>
        {unlimited ? (
          <ToneBadge tone="purple" size="sm" variant="pill">
            Unlimited
          </ToneBadge>
        ) : (
          <ToneBadge tone={level.tone} size="sm" variant="pill">
            {pct}%
          </ToneBadge>
        )}
      </div>

      <p className="mt-3 body-sm-regular text-primary-400">
        <span className="heading-h6 text-primary-500">{format(used)}</span> {unlimited ? "used" : `of ${format(limit)}`}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${label} usage`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className={cn("h-full rounded-full", unlimited ? "bg-purple" : level.bar)}
          initial={{ width: 0 }}
          animate={{ width: unlimited ? "100%" : `${Math.max(pct, used > 0 ? 2 : 0)}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 + index * 0.05 }}
          style={unlimited ? { opacity: 0.25 } : undefined}
        />
      </div>

      <div className="mt-2.5 flex min-h-8.5 items-center justify-between gap-2">
        <p className={cn("body-xsm-regular", level.note ? (level.tone === "yellow" ? "text-yellow" : "text-red") : "text-primary-300")}>
          {unlimited ? "No cap on your plan" : level.note ?? `${format(Math.max(0, (limit ?? 0) - used))} remaining`}
        </p>
        {!unlimited && pct >= 90 && onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1 body-xsm-medium text-brand-orange transition-colors hover:bg-brand-orange-light"
          >
            Upgrade <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default UsageMeter;
