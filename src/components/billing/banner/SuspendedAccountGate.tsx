"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Headset, Receipt, ShieldOff } from "lucide-react";
import { useCurrentInstitution, useSaasStore } from "@/lib/planAccess";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatUsd } from "../shared/billingFormat";

/**
 * Full-page blocking state while the subscription is SUSPENDED. /billing stays reachable so the
 * institution can pay the outstanding invoice.
 */
export function SuspendedAccountGate({ children }: { children: React.ReactNode }) {
  const inst = useCurrentInstitution();
  const store = useSaasStore();
  const pathname = usePathname();

  if (!inst || inst.subscription.status !== "SUSPENDED" || pathname?.startsWith("/billing")) return <>{children}</>;

  const outstanding = store.invoices.filter((i) => i.institutionId === inst.id && (i.status === "OPEN" || i.status === "FAILED"));
  const due = outstanding.reduce((s, i) => s + i.total, 0);
  const reason = inst.subscription.suspendedReason;

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex min-h-[70vh] items-center justify-center p-4"
    >
      <div className="dashboard-card shadow-2xs w-full max-w-xl px-6 py-10 text-center sm:px-10">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-14 text-red"
        >
          <ShieldOff className="h-8 w-8" />
        </motion.span>
        <ToneBadge tone="red" variant="pill" size="sm" dot className="mt-5">
          Account suspended
        </ToneBadge>
        <h1 className="mt-3 heading-h4 text-primary-500">Your account is suspended</h1>
        <p className="mt-2 body-regular text-primary-300">
          {inst.name} is temporarily unavailable to admins and students. Contact support or pay the outstanding invoice to restore access.
        </p>
        {reason && (
          <p className="mt-4 rounded-xl border border-red/30 bg-red-14 px-4 py-3 text-left body-sm-regular text-red-dark">
            <span className="body-sm-medium">Reason:</span> {reason}
          </p>
        )}
        {due > 0 && (
          <p className="mt-4 body-sm-regular text-primary-400">
            Outstanding balance: <span className="body-sm-medium text-primary-500">{formatUsd(due)}</span> across {outstanding.length} invoice{outstanding.length === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/billing?tab=invoices">
            <PrimaryButton leftIcon={<Receipt />}>Pay outstanding invoice</PrimaryButton>
          </Link>
          <a href="mailto:support@edupro.com">
            <SecondaryButton leftIcon={<Headset />}>Contact support</SecondaryButton>
          </a>
        </div>
      </div>
    </motion.section>
  );
}

export default SuspendedAccountGate;
