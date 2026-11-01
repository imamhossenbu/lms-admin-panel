"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Height + fade reveal for conditional fields. */
export function Collapse({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Collapse;
