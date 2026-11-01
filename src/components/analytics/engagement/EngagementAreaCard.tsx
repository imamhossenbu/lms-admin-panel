"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Kpi } from "@/lib/analytics";
import { ChartCard } from "../shared/ChartCard";
import { ChangeBadge } from "../shared/ChangeBadge";
import { CardLinkButton } from "../shared/CardLinkButton";
import { ChartLegend, type LegendItem } from "../shared/ChartLegend";

export interface AreaStat {
  label: string;
  value: string;
  kpi?: Kpi;
  invert?: boolean;
  /** Extra node instead of a change badge (e.g. an "open reports" badge). */
  extra?: React.ReactNode;
}

interface EngagementAreaCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName: string;
  href: string;
  linkLabel: string;
  stats: AreaStat[];
  legend?: LegendItem[];
  children: React.ReactNode;
  className?: string;
  index?: number;
}

/** One learning / community area: mini stats with change, a trend chart and a link to its feature page. */
export function EngagementAreaCard({ title, subtitle, icon: Icon, iconClassName, href, linkLabel, stats, legend, children, className, index }: EngagementAreaCardProps) {
  return (
    <ChartCard
      className={className}
      index={index}
      title={title}
      subtitle={
        <span className="flex items-center gap-1.5">
          <span className={cn("h-5 w-5 rounded-md flex items-center justify-center shrink-0", iconClassName)}>
            <Icon className="h-3 w-3" />
          </span>
          {subtitle}
        </span>
      }
      action={<CardLinkButton href={href}>{linkLabel}</CardLinkButton>}
      toolbar={
        <div className="space-y-3">
          <div className="grid grid-cols-1 @xs:grid-cols-2 @lg:grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="min-w-0 rounded-xl border border-dash bg-gray-bg px-3 py-2.5">
                <p className="body-2xsm-regular text-primary-300 truncate">{s.label}</p>
                <div className="mt-0.5 flex items-center gap-2 min-w-0">
                  <span className="body-l-medium font-semibold! text-primary-500 truncate">{s.value}</span>
                  {s.extra ?? (s.kpi && <ChangeBadge changePct={s.kpi.changePct} invert={s.invert} />)}
                </div>
              </div>
            ))}
          </div>
          {legend && <ChartLegend items={legend} />}
        </div>
      }
    >
      {children}
    </ChartCard>
  );
}

export default EngagementAreaCard;
