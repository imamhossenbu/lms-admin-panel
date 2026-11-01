"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { formatPercent } from "@/lib/analytics";

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  /** 0–100 */
  share: number;
  color: string;
  /** Secondary text in the legend, e.g. "12 orders". */
  detail?: string;
}

interface DonutBreakdownProps {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
  format: (value: number) => string;
  emptyTitle: string;
  emptyMessage: string;
}

/** Donut + legend (value and % share). Stacks vertically when the card is narrow (container query). */
export function DonutBreakdown({ slices, centerValue, centerLabel, format, emptyTitle, emptyMessage }: DonutBreakdownProps) {
  const visible = slices.filter((s) => s.value > 0);
  if (!visible.length) return <ChartEmpty title={emptyTitle} message={emptyMessage} />;

  return (
    <div className="flex flex-col @md:flex-row items-center gap-5">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={visible} dataKey="value" nameKey="label" innerRadius={56} outerRadius={78} paddingAngle={3} startAngle={90} endAngle={-270} stroke="none">
              {visible.map((s) => (
                <Cell key={s.key} fill={s.color} className="transition-opacity hover:opacity-85" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const s = payload[0].payload as DonutSlice;
                return (
                  <ChartTooltip title={s.label}>
                    <p className="font-semibold!">{format(s.value)}</p>
                    <p className="body-2xsm-regular text-primary-300 mt-0.5">{formatPercent(s.share)} of total</p>
                  </ChartTooltip>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="h4-semibold text-primary-500 leading-none! truncate max-w-full" title={centerValue}>
            {centerValue}
          </span>
          <span className="body-2xsm-regular text-primary-300 mt-1">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {slices.map((s) => (
          <li key={s.key} className="flex items-center gap-2.5 min-w-0">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <div className="min-w-0 flex-1">
              <p className="body-sm-medium text-primary-500 truncate" title={s.label}>
                {s.label}
              </p>
              {s.detail && <p className="body-2xsm-regular text-primary-300 truncate">{s.detail}</p>}
            </div>
            <span className="body-sm-medium font-semibold! text-primary-500 shrink-0">{format(s.value)}</span>
            <span className="body-xsm-regular text-primary-300 w-12 text-right shrink-0">{formatPercent(s.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonutBreakdown;
