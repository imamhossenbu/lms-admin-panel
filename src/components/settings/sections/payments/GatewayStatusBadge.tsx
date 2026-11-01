import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export type GatewayStatus = "CONNECTED" | "PAUSED" | "NOT_CONFIGURED";

const STATUS: Record<GatewayStatus, { label: string; tone: "green" | "gray" | "yellow" }> = {
  CONNECTED: { label: "Connected", tone: "green" },
  PAUSED: { label: "Paused", tone: "gray" },
  NOT_CONFIGURED: { label: "Not configured", tone: "gray" },
};

/** Connected (keys present + enabled) / Paused (keys present, turned off) / Not configured. */
export function gatewayStatus(enabled: boolean, hasPublicKey: boolean, hasSecret: boolean): GatewayStatus {
  if (!hasPublicKey || !hasSecret) return "NOT_CONFIGURED";
  return enabled ? "CONNECTED" : "PAUSED";
}

export function GatewayStatusBadge({ status }: { status: GatewayStatus }) {
  const s = STATUS[status];
  return (
    <ToneBadge tone={s.tone} size="sm" variant="pill" dot>
      {s.label}
    </ToneBadge>
  );
}

export default GatewayStatusBadge;
