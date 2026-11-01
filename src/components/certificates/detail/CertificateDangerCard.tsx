"use client";

import React from "react";
import { RotateCcw, ShieldAlert, ShieldOff } from "lucide-react";
import type { IssuedStatus } from "@/types/certificate";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";

export interface CertificateDangerCardProps {
  status: IssuedStatus;
  disabled?: boolean;
  onRevoke: () => void;
  onRestore: () => void;
}

/** Revoke (when valid) or Restore (when revoked) area. Hidden for expired certificates. */
export function CertificateDangerCard({ status, disabled, onRevoke, onRestore }: CertificateDangerCardProps) {
  if (status === "EXPIRED") return null;
  const revoked = status === "REVOKED";
  return (
    <IconSectionCard
      icon={revoked ? <RotateCcw className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
      title={revoked ? "Restore certificate" : "Revoke certificate"}
      description={
        revoked
          ? "Make this certificate valid again. The verification page will show it as valid."
          : "The certificate stays on record but shows as revoked on the verification page."
      }
      tone={revoked ? "green" : "red"}
      className={revoked ? undefined : "border-red"}
    >
      {revoked ? (
        <CardActionButton icon={<RotateCcw className="h-4 w-4" />} onClick={onRestore} disabled={disabled}>
          Restore Certificate
        </CardActionButton>
      ) : (
        <CardActionButton icon={<ShieldOff className="h-4 w-4" />} onClick={onRevoke} disabled={disabled} className="text-red">
          Revoke Certificate
        </CardActionButton>
      )}
    </IconSectionCard>
  );
}

export default CertificateDangerCard;
