"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { KpiTile, type KpiTileData } from "./KpiTile";

const COLS: Record<number, string> = {
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  8: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

/** Staggered grid of KPI tiles. */
export function KpiGrid({ tiles }: { tiles: KpiTileData[] }) {
  return (
    <div className={cn("grid gap-3", COLS[tiles.length] ?? COLS[4])}>
      {tiles.map((tile, i) => (
        <motion.div
          key={tile.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: i * 0.04, ease: "easeOut" }}
        >
          <KpiTile data={tile} />
        </motion.div>
      ))}
    </div>
  );
}

export default KpiGrid;
