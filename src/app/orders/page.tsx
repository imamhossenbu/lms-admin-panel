"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { StatGroupCard } from "@/components/ui/StatGroupCard";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function OrdersManagementPage() {
  const financialStats = [
    {
      label: "Total Collected",
      value: "$148,250",
      icon: <DollarSign className="w-5 h-5 text-[#1C4D8D]" />,
      trend: { direction: "up" as const, value: "18.3%", comparisonLabel: "vs last month" },
    },
    {
      label: "Successful Orders",
      value: "1,428",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      trend: { direction: "up" as const, value: "12.1%", comparisonLabel: "98.2% success rate" },
    },
    {
      label: "Pending Invoices",
      value: "14",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      description: "Awaiting gateway IPN callback",
    },
    {
      label: "Failed / Cancelled",
      value: "9",
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      description: "0.6% total dispute rate",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      <PageHeader
        title="Orders & Transaction Telemetry"
        description="Audit student checkout events, automated PDF invoice receipts, and SSLCommerz payment states."
        badge={<ToneBadge tone="ice">SSLCommerz Secured</ToneBadge>}
      />

      <StatGroupCard stats={financialStats} columns={4} />

      <RecentOrdersTable />
    </motion.div>
  );
}
