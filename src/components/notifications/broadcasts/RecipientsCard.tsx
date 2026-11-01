"use client";

import React, { useMemo } from "react";
import { RotateCcw, Users } from "lucide-react";
import type { BroadcastDelivery } from "@/types/notification";
import { useUrlParams } from "@/lib/useUrlParams";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { TablePagination } from "@/components/ui/TablePagination";
import { BroadcastsEmptyState } from "./BroadcastsEmptyState";
import { RecipientsFiltersBar, isRecipientFiltered, type RecipientFilters } from "./RecipientsFiltersBar";
import { RecipientsTable } from "./RecipientsTable";
import { parsePage } from "./broadcastFormat";

const PAGE_SIZE = 10;
const FILTER_KEYS = { rq: null, rchannel: null, rstatus: null, rpage: null } as const;

export interface RecipientsCardProps {
  deliveries: BroadcastDelivery[];
  retrying: boolean;
  onRetryFailed: () => void;
}

/** Recipients table with URL-synced filters (?rq, ?rchannel, ?rstatus, ?rpage) and "Retry failed (N)". Render inside <Suspense>. */
export function RecipientsCard({ deliveries, retrying, onRetryFailed }: RecipientsCardProps) {
  const { get, set } = useUrlParams();
  const query = get("rq");
  const channel = get("rchannel", "All");
  const status = get("rstatus", "All");
  const filters: RecipientFilters = useMemo(() => ({ query, channel, status }), [query, channel, status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deliveries.filter(
      (d) =>
        (!q || d.recipient.name.toLowerCase().includes(q) || d.recipient.email.toLowerCase().includes(q)) &&
        (channel === "All" || d.channel === channel) &&
        (status === "All" || d.status === status)
    );
  }, [deliveries, query, channel, status]);

  const failed = deliveries.filter((d) => d.status === "FAILED").length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(get("rpage")), totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const isFiltered = isRecipientFiltered(filters);

  return (
    <IconSectionCard
      icon={<Users className="h-5 w-5" />}
      title="Recipients"
      description={`${deliveries.length.toLocaleString()} messages across all channels`}
      action={
        failed > 0 ? (
          <SecondaryButton size="sm" leftIcon={<RotateCcw />} onClick={onRetryFailed} isLoading={retrying} disabled={retrying}>
            Retry failed ({failed})
          </SecondaryButton>
        ) : undefined
      }
      bodyClassName="space-y-4"
    >
      <RecipientsFiltersBar filters={filters} onChange={(u) => set({ ...u, rpage: null })} onReset={() => set({ ...FILTER_KEYS })} />
      <RecipientsTable
        rows={rows}
        emptyMessage={
          isFiltered ? (
            <BroadcastsEmptyState title="No recipients match your filters" message="Try a different search, channel or status." isFiltered onReset={() => set({ ...FILTER_KEYS })} />
          ) : (
            <BroadcastsEmptyState icon={<Users className="h-6 w-6" />} title="No recipients" message="Nobody matched this broadcast's audience when it was sent." />
          )
        }
        footer={
          filtered.length > 0 ? (
            <TablePagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalCount={filtered.length}
              itemLabel="recipients"
              onPageChange={(next) => set({ rpage: next === 1 ? null : next })}
            />
          ) : undefined
        }
      />
    </IconSectionCard>
  );
}

export default RecipientsCard;
