"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarX, ShieldOff } from "lucide-react";
import type { IssuedCertificate, IssuedStatus } from "@/types/certificate";
import { formatCertDate } from "@/lib/certificateStats";

export interface CertificateStatusBannerProps {
  certificate: IssuedCertificate;
  status: IssuedStatus;
}

/** Red "Revoked on … — reason" or gray "Expired on …" strip above the certificate. Nothing when valid. */
export function CertificateStatusBanner({ certificate: c, status }: CertificateStatusBannerProps) {
  if (status === "VALID") return null;
  const revoked = status === "REVOKED";
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="status"
      className={
        revoked
          ? "flex items-start gap-3 rounded-xl border border-red bg-red-14 p-3.5 text-red-dark"
          : "flex items-start gap-3 rounded-xl border border-dash bg-gray-bg p-3.5 text-primary-400"
      }
    >
      {revoked ? <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-red" /> : <CalendarX className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" />}
      <div className="min-w-0">
        <p className="body-sm-medium font-semibold!">
          {revoked
            ? `Revoked${c.revokedAt ? ` on ${formatCertDate(c.revokedAt)}` : ""}${c.revokedReason ? ` — ${c.revokedReason}` : ""}`
            : `Expired on ${c.expiresAt ? formatCertDate(c.expiresAt) : "—"}`}
        </p>
        <p className="mt-0.5 body-xsm-regular">
          {revoked
            ? "Anyone checking this certificate sees it as revoked. Restore it to make it valid again."
            : "The verification page shows this certificate as expired. Reissue it to give the learner a new one."}
        </p>
      </div>
    </motion.div>
  );
}

export default CertificateStatusBanner;
