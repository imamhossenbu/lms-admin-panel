"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsersTableClient } from "@/components/users/UsersTableClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

export default function UsersManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      <PageHeader
        title="User & Access Directory"
        description="Oversee student enrollments, instructor credentials, and administrative authority."
        badge={<ToneBadge tone="navy">RBAC Enforced</ToneBadge>}
      />
      <UsersTableClient />
    </motion.div>
  );
}
