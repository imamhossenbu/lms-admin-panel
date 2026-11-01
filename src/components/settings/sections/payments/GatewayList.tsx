"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { GATEWAYS } from "./paymentsMeta";
import { GatewayCard } from "./GatewayCard";

/** All gateway cards + the "enable at least one" rule shown under them. */
export function GatewayList({ secretHints }: { secretHints: Record<string, string> }) {
  const { formState } = useFormContext<PaymentSettings>();
  const atLeastOne = formState.errors.sslcommerz?.enabled?.message;

  return (
    <div id="payments-gateways" className="space-y-4">
      {GATEWAYS.map((g, i) => (
        <motion.div key={g.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.05 }}>
          <GatewayCard gateway={g} secretHint={secretHints[`payments.${g.key}.secretKey`]} />
        </motion.div>
      ))}
      <AnimatePresence initial={false}>
        {atLeastOne && (
          <motion.p
            key="gateway-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 rounded-xl border border-red/30 bg-red-14 px-4 py-3 body-sm-medium text-red"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {atLeastOne}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GatewayList;
