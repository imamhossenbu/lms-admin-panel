"use client";

import React from "react";
import { AppSelect } from "@/components/ui/AppSelect";
import { FilterSearchInput } from "./FilterSearchInput";
import { FilterResetButton } from "./FilterResetButton";
import { CHANNEL_OPTIONS, DELIVERY_STATUS_OPTIONS } from "./broadcastFormat";

export interface RecipientFilters {
  query: string;
  channel: string;
  status: string;
}

export const isRecipientFiltered = (f: RecipientFilters) => Boolean(f.query.trim()) || f.channel !== "All" || f.status !== "All";

export interface RecipientsFiltersBarProps {
  filters: RecipientFilters;
  /** Keys: rq, rchannel, rstatus. */
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
}

/** Search (name / email) + Channel + Status + Reset. */
export function RecipientsFiltersBar({ filters, onChange, onReset }: RecipientsFiltersBarProps) {
  return (
    <div className="@container">
      <div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center">
        <FilterSearchInput value={filters.query} onChange={(v) => onChange({ rq: v })} placeholder="Search name or email..." ariaLabel="Search recipients" className="@3xl:w-80 @3xl:shrink-0" />
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 @md:grid-cols-2 @3xl:flex @3xl:items-center @3xl:justify-end">
          <AppSelect value={filters.channel} onValueChange={(v) => onChange({ rchannel: v })} options={CHANNEL_OPTIONS} className="w-full @3xl:w-40 @3xl:shrink-0" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.status} onValueChange={(v) => onChange({ rstatus: v })} options={DELIVERY_STATUS_OPTIONS} className="w-full @3xl:w-40 @3xl:shrink-0" triggerClassName="w-full bg-white" />
          <FilterResetButton active={isRecipientFiltered(filters)} onReset={onReset} />
        </div>
      </div>
    </div>
  );
}

export default RecipientsFiltersBar;
