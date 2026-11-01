"use client";

import React, { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import type { CertificateEvent } from "@/types/certificate";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CertificateActivityItem } from "./CertificateActivityItem";

const PAGE = 6;

export interface CertificateActivityCardProps {
  events: CertificateEvent[];
}

/** Newest-first event log (issued, emailed, downloaded, verified, revoked, restored …) with "Show More". */
export function CertificateActivityCard({ events }: CertificateActivityCardProps) {
  const [limit, setLimit] = useState(PAGE);
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const shown = sorted.slice(0, limit);
  return (
    <IconSectionCard
      icon={<History className="h-5 w-5" />}
      title="Activity"
      description="Everything that happened to this certificate"
      tone="purple"
      action={<ToneBadge tone="gray" size="sm">{events.length.toLocaleString()}</ToneBadge>}
    >
      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash p-4 text-center body-sm-regular text-primary-300">No activity yet.</p>
      ) : (
        <ol>
          {shown.map((e, i) => (
            <CertificateActivityItem key={e.id} event={e} index={i} last={i === shown.length - 1} />
          ))}
        </ol>
      )}
      {sorted.length > limit && (
        <div className="mt-3 flex justify-center">
          <CardActionButton icon={<ChevronDown className="h-4 w-4" />} onClick={() => setLimit((l) => l + PAGE)}>
            Show More ({sorted.length - limit})
          </CardActionButton>
        </div>
      )}
    </IconSectionCard>
  );
}

export default CertificateActivityCard;
