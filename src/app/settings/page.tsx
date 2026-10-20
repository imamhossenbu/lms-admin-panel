"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsFormClient } from "@/components/settings/SettingsFormClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

export default function PlatformSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      <PageHeader
        title="Platform & White-Label Configuration"
        description="Manage system-wide environment variables, branding palettes, and security rules."
        badge={<ToneBadge tone="navy">Admin Only</ToneBadge>}
      />
      <SettingsFormClient />
    </motion.div>
  );
}
