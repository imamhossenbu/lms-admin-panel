"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard, type DashboardStat } from "./StatCard";

export function StatCardsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: i * 0.04, ease: "easeOut" }}
        >
          <StatCard stat={stat} />
        </motion.div>
      ))}
    </div>
  );
}
