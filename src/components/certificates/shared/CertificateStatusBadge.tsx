import React from "react";
import type { IssuedStatus } from "@/types/certificate";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";

export const CERT_STATUS_VIEW: Record<IssuedStatus, { label: string; tone: Tone }> = {
  VALID: { label: "Valid", tone: "green" },
  REVOKED: { label: "Revoked", tone: "red" },
  EXPIRED: { label: "Expired", tone: "gray" },
};

export interface CertificateStatusBadgeProps {
  status: IssuedStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Valid (green) / Revoked (red) / Expired (gray). */
export function CertificateStatusBadge({ status, size = "sm", className }: CertificateStatusBadgeProps) {
  const view = CERT_STATUS_VIEW[status];
  return (
    <ToneBadge tone={view.tone} size={size} dot className={className}>
      {view.label}
    </ToneBadge>
  );
}

export default CertificateStatusBadge;
