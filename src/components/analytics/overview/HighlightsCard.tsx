"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, CalendarCheck, CreditCard, Layers, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChartCard } from "../shared/ChartCard";
import { ChangeBadge } from "../shared/ChangeBadge";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/analytics";
import type { OverviewReport } from "../report/analyticsReport";
import { cn } from "@/lib/cn";

interface HighlightItem {
  id: string;
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  value: string;
  detail: string;
  badge?: React.ReactNode;
}

/** Plain-English highlights generated from the overview data (best course, best day, biggest change …). */
export function HighlightsCard({ highlights, currency, index }: { highlights: OverviewReport["highlights"]; currency: string; index?: number }) {
  const { bestCourse, bestDay, biggestChange, topMethod, topCategory } = highlights;
  const money = (v: number) => formatCurrency(v, currency, { decimals: 0 });

  const items: HighlightItem[] = [
    bestCourse && {
      id: "course",
      icon: Award,
      iconClassName: "bg-brand-orange-light text-brand-orange",
      title: "Best-selling course",
      value: bestCourse.title,
      detail: `${money(bestCourse.revenue)} from ${formatNumber(bestCourse.enrollments)} ${bestCourse.enrollments === 1 ? "enrollment" : "enrollments"}`,
    },
    bestDay && {
      id: "day",
      icon: CalendarCheck,
      iconClassName: "bg-green-bg text-green",
      title: "Best revenue day",
      value: bestDay.fullLabel,
      detail: `${money(bestDay.net)} from ${formatNumber(bestDay.paidOrders)} paid ${bestDay.paidOrders === 1 ? "order" : "orders"}`,
    },
    biggestChange && {
      id: "change",
      icon: TrendingUp,
      iconClassName: "bg-blue-14 text-blue",
      title: "Biggest change",
      value: biggestChange.label,
      detail: "Compared with the previous period",
      badge: <ChangeBadge changePct={biggestChange.kpi.changePct} />,
    },
    topMethod && {
      id: "method",
      icon: CreditCard,
      iconClassName: "bg-purple-14 text-purple",
      title: "Top payment method",
      value: topMethod.label,
      detail: `${formatPercent(topMethod.share)} of net revenue`,
    },
    topCategory && {
      id: "category",
      icon: Layers,
      iconClassName: "bg-yellow-bg text-yellow",
      title: "Most popular category",
      value: topCategory.label,
      detail: `${formatNumber(topCategory.value)} new ${topCategory.value === 1 ? "enrollment" : "enrollments"}`,
    },
  ].filter(Boolean) as HighlightItem[];

  return (
    <ChartCard title="Highlights" subtitle="What stood out in this period" index={index}>
      {items.length === 0 ? (
        <p className="body-sm-regular text-primary-300 py-10 text-center">No activity in this period yet.</p>
      ) : (
        <ul className="divide-y divide-dash">
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", item.iconClassName)}>
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="body-2xsm-regular text-primary-300">{item.title}</p>
                <p className="body-sm-medium font-semibold! text-primary-500 truncate" title={item.value}>
                  {item.value}
                </p>
                <p className="body-xsm-regular text-primary-300 truncate">{item.detail}</p>
              </div>
              {item.badge}
            </motion.li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

export default HighlightsCard;
