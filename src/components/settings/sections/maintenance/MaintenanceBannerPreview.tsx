"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Construction, Eye } from "lucide-react";
import { formatUntil } from "./maintenanceUtils";

export interface MaintenanceBannerPreviewProps {
  platformName: string;
  message: string;
  until: string;
}

/** Red "what visitors see" banner, shown while maintenance mode is on. */
export function MaintenanceBannerPreview({ platformName, message, until }: MaintenanceBannerPreviewProps) {
  const back = formatUntil(until);
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 body-xsm-medium text-primary-300">
        <Eye className="h-3.5 w-3.5" />
        Visitor preview
      </p>
      <div className="overflow-hidden rounded-xl border border-dash bg-white shadow-2xs">
        <div className="flex items-center gap-1.5 border-b border-dash bg-gray-bg px-3 py-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-red" />
          <span className="h-2 w-2 rounded-full bg-yellow" />
          <span className="h-2 w-2 rounded-full bg-green" />
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 body-2xsm-regular text-primary-300">{platformName.toLowerCase().replace(/\s+/g, "")}.com</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-start gap-3 bg-red px-4 py-3.5 text-white"
        >
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15"
          >
            <Construction className="h-4.5 w-4.5" />
          </motion.span>
          <div className="min-w-0">
            <p className="body-sm-medium font-semibold!">{platformName} is under maintenance</p>
            <p className="mt-0.5 body-xsm-regular break-words opacity-90">{message.trim() || "Your message to visitors will appear here."}</p>
            {back && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 body-xsm-medium">
                <Clock className="h-3.5 w-3.5" />
                Expected back {back}
              </p>
            )}
          </div>
        </motion.div>
        <div className="space-y-2 p-4" aria-hidden>
          <div className="h-2.5 w-2/5 rounded-full bg-slate-100" />
          <div className="h-2.5 w-4/5 rounded-full bg-slate-100" />
          <div className="h-2.5 w-3/5 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default MaintenanceBannerPreview;
