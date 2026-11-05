"use client";

import type { CertificateActivity } from "@/lib/certificateStorage";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Award, Ban, Download, Mail, RefreshCw, RotateCcw, ScanLine } from "lucide-react";
import type { CertificateEventKind } from "@/types/certificate";
import { cn } from "@/lib/cn";
import { InsightCard } from "./InsightCard";
import { timeAgo } from "./certificateListUtils";

const EVENT_VIEW: Record<CertificateEventKind, { icon: React.ElementType; className: string }> = {
  ISSUED: { icon: Award, className: "bg-brand-orange-light text-brand-orange" },
  EMAILED: { icon: Mail, className: "bg-blue-14 text-blue" },
  DOWNLOADED: { icon: Download, className: "bg-green-bg text-green" },
  VERIFIED: { icon: ScanLine, className: "bg-purple-14 text-purple" },
  REVOKED: { icon: Ban, className: "bg-red-14 text-red" },
  RESTORED: { icon: RotateCcw, className: "bg-green-bg text-green" },
  REISSUED: { icon: RefreshCw, className: "bg-yellow-bg text-yellow" },
};

const LIMIT = 6;

/** Latest certificate events (issued, emailed, verified …) linking to the certificate. */
export function RecentActivityCard({ events, index, className }: { events: CertificateActivity[]; index?: number; className?: string }) {
  const latest = [...events].sort((a, b) => b.at.localeCompare(a.at)).slice(0, LIMIT);
  return (
    <InsightCard index={index} className={className} icon={<Activity className="h-4 w-4" />} iconClassName="bg-green-bg text-green" title="Recent Activity">
      {latest.length === 0 ? (
        <p className="py-8 text-center body-sm-regular text-primary-300">No certificate activity yet.</p>
      ) : (
        <ul className="flex flex-col">
          {latest.map((e, i) => {
            const view = EVENT_VIEW[e.kind];
            const Icon = view.icon;
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 + i * 0.04 }}
                className="border-b border-dash last:border-b-0"
              >
                <Link href={`/certificates/${e.certificateId}`} className="flex items-start gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-slate-50">
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", view.className)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate body-sm-medium text-primary-500">{e.recipientName || "Deleted certificate"}</span>
                    <span className="block truncate body-xsm-regular text-primary-300" title={e.message}>
                      {e.message}
                    </span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap body-2xsm-regular text-primary-300">{timeAgo(e.at)}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}
    </InsightCard>
  );
}

export default RecentActivityCard;
