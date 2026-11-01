import React from "react";
import { Lock } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface UpgradeBadgeProps {
  /** Plan that unlocks the feature, e.g. "Pro". */
  planName?: string;
  className?: string;
}

/** Tiny lock + plan name pill for locked nav items, toggles and cards. */
export function UpgradeBadge({ planName = "Pro", className }: UpgradeBadgeProps) {
  return (
    <ToneBadge tone="orange" size="sm" variant="pill" icon={<Lock className="h-2.5 w-2.5" />} className={className}>
      {planName}
    </ToneBadge>
  );
}

export default UpgradeBadge;
