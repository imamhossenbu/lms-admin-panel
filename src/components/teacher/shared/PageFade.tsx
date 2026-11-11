"use client";

import React from "react";
import { motion } from "framer-motion";

/** Page entry animation used by every teacher page. */
export function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      {children}
    </motion.div>
  );
}

export default PageFade;
