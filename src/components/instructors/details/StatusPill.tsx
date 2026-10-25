import React from "react";
import { CheckCircle2, CircleDot } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

interface StatusPillProps {
  status: "Active" | "Inactive" | "Draft";
  size?: "sm" | "md";
}

/** Active (green check) vs. Draft/Inactive (grey) status, built on ToneBadge. */
export function StatusPill({ status, size = "md" }: StatusPillProps) {
  const isActive = status === "Active";
  return (
    <ToneBadge
      tone={isActive ? "green" : "gray"}
      size={size}
      icon={
        isActive ? (
          <CheckCircle2 className="w-3.5 h-3.5 fill-current [&>path]:stroke-white" />
        ) : (
          <CircleDot className="w-3.5 h-3.5" />
        )
      }
    >
      {status}
    </ToneBadge>
  );
}

export default StatusPill;
