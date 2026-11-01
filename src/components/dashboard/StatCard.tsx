"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, User, BookOpen, Wallet, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { changeDirection, type Kpi } from "@/lib/analytics";
import { Sparkline } from "./Sparkline";

export interface DashboardStat {
  id: string;
  label: string;
  /** Formatted value. */
  value: string;
  kpi: Kpi;
  /** e.g. "vs previous 30 days". */
  caption: string;
  icon: "users" | "user" | "book-open" | "wallet";
  colorScheme: "orange" | "blue" | "green" | "purple";
}

const ICONS = { users: Users, user: User, "book-open": BookOpen, wallet: Wallet };

const SCHEME = {
  orange: "bg-brand-orange-light text-brand-orange",
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  purple: "bg-purple-14 text-purple",
};

const TREND = {
  up: { icon: ArrowUpRight, className: "text-green" },
  down: { icon: ArrowDownRight, className: "text-red" },
  flat: { icon: Minus, className: "text-primary-300" },
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  const IconComponent = ICONS[stat.icon];
  const direction = changeDirection(stat.kpi.changePct);
  const trend = TREND[direction];
  const TrendIcon = trend.icon;
  const change = stat.kpi.changePct === null ? null : `${Math.abs(stat.kpi.changePct).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  const caption = change === null ? (stat.caption === "all time" ? "All time" : "No data in previous period") : stat.caption;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-xl border border-dash py-3.5 px-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
    >
      {/* Top Part: Icon, Value and Label */}
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${SCHEME[stat.colorScheme]}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex flex-col text-left">
          <span className="h3-semibold font-bold! text-primary-500 tracking-tight leading-none!">{stat.value}</span>
          <span className="body-xsm-medium text-primary-400 mt-1">{stat.label}</span>
        </div>
      </div>

      {/* Bottom Part: Trend & Mini Sparkline */}
      <div className="flex items-end justify-between mt-3 pt-0.5">
        <div className="flex items-center min-w-0">
          {change !== null && (
            <span className={`body-xsm-medium font-bold flex items-center gap-0.5 ${trend.className}`}>
              <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {change}
            </span>
          )}
          <span className={`body-2xsm-regular text-primary-300 truncate ${change !== null ? "ml-1.5" : ""}`}>{caption}</span>
        </div>

        <div className="shrink-0 pl-2">
          <Sparkline data={stat.kpi.spark} color={stat.colorScheme} width={84} height={26} />
        </div>
      </div>
    </motion.div>
  );
}
