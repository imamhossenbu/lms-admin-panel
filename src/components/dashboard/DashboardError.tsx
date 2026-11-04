"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";

/** A dashboard / analytics report couldn't load (network, permission, server). */
export function DashboardError({ message, title = "Couldn't load the dashboard" }: { message: string; title?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-xl border border-dash p-12 text-center shadow-2xs space-y-3"
    >
      <div className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="heading-h5 text-primary-500">{title}</h3>
      <p className="body-sm-regular text-primary-300 max-w-md mx-auto">{message}</p>
      <div className="pt-2">
        <SecondaryButton type="button" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={() => window.location.reload()}>
          Try again
        </SecondaryButton>
      </div>
    </motion.div>
  );
}

export default DashboardError;
