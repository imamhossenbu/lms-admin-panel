import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { changeDirection, formatChange } from "@/lib/analytics";

interface ChangeBadgeProps {
  changePct: number | null;
  /** Lower is better (e.g. refunds): a rise is shown in red. */
  invert?: boolean;
}

/** Period-over-period change pill (ToneBadge): green up / red down / grey flat or "—". */
export function ChangeBadge({ changePct, invert = false }: ChangeBadgeProps) {
  const dir = changeDirection(changePct);
  const good = invert ? dir === "down" : dir === "up";
  const tone = dir === "flat" ? "gray" : good ? "green" : "red";
  const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  return (
    <ToneBadge tone={tone} size="sm" variant="pill" icon={<Icon className="h-3 w-3" strokeWidth={2.5} />}>
      {formatChange(changePct)}
    </ToneBadge>
  );
}

export default ChangeBadge;
