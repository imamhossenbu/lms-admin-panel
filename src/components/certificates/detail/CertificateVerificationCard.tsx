"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, type LucideIcon, CalendarSearch, Eye } from "lucide-react";
import type { IssuedCertificate } from "@/types/certificate";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { CertificateQr } from "../shared/CertificateParts";
import { CERT_SCALE } from "../shared/certificateScale";
import { exactDate, plural, timeAgo } from "./certificateDetailFormat";

export interface CertificateVerificationCardProps {
  certificate: IssuedCertificate;
  link: string;
  lastVerifiedAt: string | null;
  onOpen: () => void;
}

function VerificationStat({ icon: Icon, label, value, title }: { icon: LucideIcon; label: string; value: string; title?: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-dash bg-white p-3" title={title}>
      <p className="flex items-center gap-2 body-xsm-regular text-primary-300">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </p>
      <p className="mt-1 body-l-medium font-semibold! text-primary-500">{value}</p>
    </motion.div>
  );
}

/** Public verification link (+ copy), QR-style block and verification counters. */
export function CertificateVerificationCard({ certificate, link, lastVerifiedAt, onOpen }: CertificateVerificationCardProps) {
  return (
    <IconSectionCard
      icon={<ShieldCheck className="h-5 w-5" />}
      title="Verification"
      description="Anyone with this link or QR code can confirm the certificate is genuine."
      tone="green"
      action={
        <CardActionButton icon={<ExternalLink className="h-4 w-4" />} onClick={onOpen}>
          Open
        </CardActionButton>
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex shrink-0 justify-center rounded-xl border border-dash bg-gray-bg p-4">
          <CertificateQr code={certificate.code} s={CERT_SCALE.lg} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="mb-1.5 body-sm-medium font-semibold! text-primary-500">Verification link</p>
            <div className="flex items-center gap-2 rounded-lg border border-dash bg-gray-bg px-3.5 py-2.5">
              <span className="min-w-0 flex-1 truncate body-sm-regular text-primary-400" title={link}>
                {link}
              </span>
              <CopyButton value={link} label="Verification link copied" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <VerificationStat icon={Eye} label="Verified" value={plural(certificate.verifications, "time")} />
            <VerificationStat
              icon={CalendarSearch}
              label="Last verification"
              value={lastVerifiedAt ? timeAgo(lastVerifiedAt) : "Never"}
              title={lastVerifiedAt ? exactDate(lastVerifiedAt) : undefined}
            />
          </div>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default CertificateVerificationCard;
