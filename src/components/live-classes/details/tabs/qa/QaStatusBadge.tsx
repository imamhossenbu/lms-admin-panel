import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LiveQuestion } from "@/types/liveClass";

/** Answered (green) / Pending (orange). */
export function QaStatusBadge({ status }: { status: LiveQuestion["status"] }) {
  return status === "ANSWERED" ? <ToneBadge tone="green">Answered</ToneBadge> : <ToneBadge tone="orange">Pending</ToneBadge>;
}

export default QaStatusBadge;
