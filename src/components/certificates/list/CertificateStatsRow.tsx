"use client";

import React from "react";
import { ArrowDown, ArrowUp, Award, CalendarClock, CalendarPlus, ShieldCheck, ShieldX } from "lucide-react";
import type { CertificateOverview } from "@/lib/certificateStorage";
import { CertificateStatCard } from "./CertificateStatCard";

const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);

/** Issued / Last 30 days (+delta) / Valid / Expiring in 30 days / Revoked + Expired — all from certificateListStats. */
export function CertificateStatsRow({ stats: s }: { stats: CertificateOverview }) {
  const delta = s.last30Delta;
  const tiles = [
    { label: "Certificates Issued", value: s.total, icon: <Award className="h-5 w-5" />, iconClassName: "bg-brand-orange-light text-brand-orange", caption: "All time" },
    {
      label: "Issued Last 30 Days",
      value: s.last30,
      icon: <CalendarPlus className="h-5 w-5" />,
      iconClassName: "bg-blue-14 text-blue",
      pill:
        delta === null
          ? undefined
          : {
              text: (
                <span className="inline-flex items-center gap-0.5">
                  {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(delta)}%
                </span>
              ),
              tone: delta > 0 ? ("green" as const) : delta < 0 ? ("red" as const) : ("gray" as const),
            },
      caption: delta === null ? "No issues in the previous 30 days" : "vs the previous 30 days",
    },
    { label: "Valid", value: s.valid, icon: <ShieldCheck className="h-5 w-5" />, iconClassName: "bg-green-bg text-green", pill: { text: `${pct(s.valid, s.total)}%`, tone: "green" as const }, caption: "Currently verifiable" },
    { label: "Expiring in 30 Days", value: s.expiringSoon, icon: <CalendarClock className="h-5 w-5" />, iconClassName: "bg-yellow-bg text-yellow", caption: s.expiringSoon ? "Valid now, expire soon" : "Nothing expires soon" },
    {
      label: "Revoked / Expired",
      value: s.revoked + s.expired,
      icon: <ShieldX className="h-5 w-5" />,
      iconClassName: "bg-red-14 text-red",
      pill: { text: `${pct(s.revoked + s.expired, s.total)}%`, tone: "red" as const },
      caption: `${s.revoked} revoked · ${s.expired} expired`,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tiles.map((t, i) => (
        <CertificateStatCard key={t.label} index={i} {...t} />
      ))}
    </div>
  );
}

export default CertificateStatsRow;
