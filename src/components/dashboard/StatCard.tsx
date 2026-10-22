"use client";

import React from "react";
import { Users, User, BookOpen, Database, ArrowUpRight } from "lucide-react";
import { StatMetric } from "@/types/dashboard";
import { Sparkline } from "./Sparkline";

interface StatCardProps {
  stat: StatMetric;
}

const ICON_CONFIG = {
  orange: {
    bg: "bg-[#FFF4ED]",
    textColor: "text-[#FF5B00]",
    icon: Users,
  },
  blue: {
    bg: "bg-[#EFF6FF]",
    textColor: "text-[#3B82F6]",
    icon: User,
  },
  green: {
    bg: "bg-[#F0FDF4]",
    textColor: "text-[#22C55E]",
    icon: BookOpen,
  },
  purple: {
    bg: "bg-[#FAF5FF]",
    textColor: "text-[#A855F7]",
    icon: Database,
  },
};

export function StatCard({ stat }: StatCardProps) {
  const config = ICON_CONFIG[stat.colorScheme] || ICON_CONFIG.orange;
  const IconComponent = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-dash p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative flex flex-col justify-between">
      {/* Top Part: Icon, Value and Label */}
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.textColor}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex flex-col text-left">
          <span className="heading-h2-bold text-primary-500 tracking-tight">
            {stat.value}
          </span>
          <span className="body-sm-medium text-primary-300 mt-0.5">
            {stat.label}
          </span>
        </div>
      </div>

      {/* Bottom Part: Trend & Mini Sparkline */}
      <div className="flex items-end justify-between mt-5 pt-1">
        <div className="flex items-center">
          <span className="body-sm-medium font-bold text-[#16A34A] flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            {stat.change}
          </span>
          <span className="body-2xsm-regular text-primary-300 ml-1.5">
            {stat.comparedTo}
          </span>
        </div>

        <div className="shrink-0 pl-2">
          <Sparkline data={stat.sparklineData} color={stat.colorScheme} width={90} height={32} />
        </div>
      </div>
    </div>
  );
}
