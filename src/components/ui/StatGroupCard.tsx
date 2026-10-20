"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { StatCard, StatItem } from "./StatCard";

export interface StatGroupCardProps {
  stats: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function StatGroupCard({
  stats,
  className,
  columns = 4,
}: StatGroupCardProps) {
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 2:
        return "lg:grid-cols-2";
      case 3:
        return "md:grid-cols-3 lg:grid-cols-3";
      case 5:
        return "md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "md:grid-cols-3 lg:grid-cols-6";
      default:
        return "md:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <div
      className={cn(
        "w-full grid grid-cols-1 sm:grid-cols-2 gap-3",
        getGridColsClass(columns),
        className
      )}
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label + idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: idx * 0.05, ease: "easeOut" }}
          className="w-full flex"
        >
          <StatCard {...stat} index={idx} />
        </motion.div>
      ))}
    </div>
  );
}

export { StatCard };
export default StatGroupCard;
