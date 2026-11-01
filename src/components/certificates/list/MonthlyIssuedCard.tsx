"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartColumnBig } from "lucide-react";
import type { IssuedCertificate } from "@/types/certificate";
import { monthlyIssued } from "@/lib/certificateStats";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { InsightCard } from "./InsightCard";

/** Orange bar per month (last 6 months) from monthlyIssued. */
export function MonthlyIssuedCard({ certificates, index }: { certificates: IssuedCertificate[]; index?: number }) {
  const data = monthlyIssued(certificates, 6);
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <InsightCard
      index={index}
      icon={<ChartColumnBig className="h-4 w-4" />}
      iconClassName="bg-brand-orange-light text-brand-orange"
      title="Issued per Month"
      aside={
        <ToneBadge tone="gray" size="sm">
          {total} in 6 months
        </ToneBadge>
      }
    >
      {total === 0 ? (
        <ChartEmpty title="No certificates yet" message="Monthly issue counts appear once certificates are issued." />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: "var(--color-brand-orange-light)" }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <ChartTooltip title={String(label)}>
                      {Number(payload[0].value)} certificate{payload[0].value === 1 ? "" : "s"}
                    </ChartTooltip>
                  ) : null
                }
              />
              <Bar dataKey="count" fill={CHART.orange} radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </InsightCard>
  );
}

export default MonthlyIssuedCard;
