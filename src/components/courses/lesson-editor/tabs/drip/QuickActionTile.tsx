"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface QuickActionTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "red" | "blue";
  onClick: () => void;
}

/** Bordered action tile in "Quick Actions". */
export function QuickActionTile({ icon, title, description, tone, onClick }: QuickActionTileProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-dash bg-white p-3.5 text-left transition-colors hover:border-primary-300/40"
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone === "red" ? "bg-red-14 text-red" : "bg-blue-14 text-blue")}>{icon}</span>
      <span className="min-w-0">
        <span className="block body-sm-medium text-primary-500">{title}</span>
        <span className="mt-0.5 block body-xsm-regular text-primary-300">{description}</span>
      </span>
    </motion.button>
  );
}

export default QuickActionTile;
