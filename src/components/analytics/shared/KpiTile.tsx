"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { changeDirection, formatChange, type Kpi } from "@/lib/analytics";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { cn } from "@/lib/cn";

export type KpiTone = "orange" | "blue" | "green" | "purple";

export interface KpiTileData {
  id: string;
  label: string;
  /** Formatted value. */
  value: string;
  icon: LucideIcon;
  tone: KpiTone;
  /** Omit for metrics without a comparison (no change line, no sparkline). */
  kpi?: Kpi;
  /** e.g. "vs previous 30 days". */
  caption: string;
  /** Lower is better (refunds). */
  invert?: boolean;
}

const TONE = {
  orange: "bg-brand-orange-light text-brand-orange",
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  purple: "bg-purple-14 text-purple",
};

/** KPI tile: icon, value, label, change vs previous period and a 10-point sparkline. */
export function KpiTile({ data }: { data: KpiTileData }) {
  const Icon = data.icon;
  const change = data.kpi?.changePct ?? null;
  const dir = changeDirection(change);
  const good = data.invert ? dir === "down" : dir === "up";
  const TrendIcon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  const caption =
    change === null ? (data.caption === "all time" ? "All time" : data.kpi ? "No data in previous period" : data.caption) : data.caption;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="@container h-full bg-white rounded-xl border border-dash py-3.5 px-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", TONE[data.tone])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex flex-col text-left">
          <span className="h3-semibold font-bold! text-primary-500 tracking-tight leading-none! truncate" title={data.value}>
            {data.value}
          </span>
          <span className="body-xsm-medium text-primary-400 mt-1 truncate">{data.label}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 mt-3">
        <div className="flex items-center min-w-0 gap-1.5">
          {change !== null && (
            <span className={cn("body-xsm-medium font-semibold! flex items-center gap-0.5 shrink-0", dir === "flat" ? "text-primary-300" : good ? "text-green" : "text-red")}>
              <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {formatChange(change).replace(/^[+−]/, "")}
            </span>
          )}
          <span className="body-2xsm-regular text-primary-300 truncate">{caption}</span>
        </div>
        {data.kpi && (
          <div className="shrink-0">
            <Sparkline data={data.kpi.spark} color={data.tone} width={64} height={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default KpiTile;
