"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, HelpCircle } from "lucide-react";

export const ASSIGNMENT_DOCS_URL = "https://docs.edupro.example/assignments";

/** "Need Help?" box with a "View Documentation" link (opens in a new tab). */
export function NeedHelpCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      className="flex items-start gap-3 rounded-2xl border border-blue/20 bg-blue-14 p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dash bg-white text-blue">
        <HelpCircle className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h3 className="body-sm-medium font-semibold! text-primary-500">Need Help?</h3>
        <p className="mt-0.5 body-xsm-regular text-primary-300">Learn how to create effective assignments for better student engagement.</p>
        <motion.a
          whileTap={{ scale: 0.96 }}
          href={ASSIGNMENT_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-dash bg-white px-3 body-xsm-medium text-blue transition-colors hover:bg-blue-14"
        >
          View Documentation
          <ExternalLink className="h-3.5 w-3.5" />
        </motion.a>
      </div>
    </motion.section>
  );
}

export default NeedHelpCard;
