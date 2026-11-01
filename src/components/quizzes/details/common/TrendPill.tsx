import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface TrendPillProps {
  /** Percent change from trendVsPrevious; null renders nothing (no baseline). */
  value: number | null;
}

/** "↑ 18%" / "↓ 6%" change pill. Hidden when there is no previous-period baseline. */
export function TrendPill({ value }: TrendPillProps) {
  if (value === null) return null;
  const up = value >= 0;
  return (
    <ToneBadge tone={up ? "green" : "red"} size="sm" icon={up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}>
      {Math.abs(value)}%
    </ToneBadge>
  );
}

export default TrendPill;
