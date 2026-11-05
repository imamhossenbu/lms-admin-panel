"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, ScanLine, Zap } from "lucide-react";
import type { CertificateOverview } from "@/lib/certificateStorage";

/** Slim strip: "N verifications · N downloads · N% auto-issued". */
export function CertificateInsightStrip({ stats: s }: { stats: CertificateOverview }) {
  const items = [
    { key: "verifications", icon: <ScanLine className="h-4 w-4 text-blue" />, value: s.verifications.toLocaleString(), label: "verifications" },
    { key: "downloads", icon: <Download className="h-4 w-4 text-green" />, value: s.downloads.toLocaleString(), label: "downloads" },
    { key: "auto", icon: <Zap className="h-4 w-4 text-brand-orange" />, value: `${s.autoShare}%`, label: "auto-issued" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.15 }}
      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-dash bg-gray-bg px-4 py-2.5"
    >
      {items.map((item, i) => (
        <span key={item.key} className="inline-flex items-center gap-2 body-sm-regular text-primary-400">
          {i > 0 && <span className="mr-3 hidden h-4 w-px bg-slate-200 sm:inline-block" aria-hidden />}
          {item.icon}
          <span className="body-sm-medium font-semibold! text-primary-500 tabular-nums">{item.value}</span>
          {item.label}
        </span>
      ))}
    </motion.div>
  );
}

export default CertificateInsightStrip;
