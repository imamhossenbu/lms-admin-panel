"use client";

import React from "react";
import { AppSelect } from "@/components/ui/AppSelect";
import { FilterSearchInput } from "./FilterSearchInput";
import { FilterResetButton } from "./FilterResetButton";
import { AUDIENCE_OPTIONS, BROADCAST_STATUS_OPTIONS, CHANNEL_OPTIONS, isBroadcastFiltered, type BroadcastFilters } from "./broadcastFormat";

export interface BroadcastsFiltersBarProps {
  filters: BroadcastFilters;
  /** Keys: bq, bstatus, baudience, bchannel. */
  onChange: (updates: Record<string, string | null>) => void;
  onReset: () => void;
}

/** Search + Status / Audience / Channel + Reset; container queries keep it tidy at any card width. */
export function BroadcastsFiltersBar({ filters, onChange, onReset }: BroadcastsFiltersBarProps) {
  return (
    <div className="@container">
      <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-center">
        <FilterSearchInput
          value={filters.query}
          onChange={(v) => onChange({ bq: v })}
          placeholder="Search title or audience..."
          ariaLabel="Search broadcasts"
          className="@4xl:w-80 @4xl:shrink-0"
        />
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 @md:grid-cols-3 @4xl:flex @4xl:items-center @4xl:justify-end">
          <AppSelect value={filters.status} onValueChange={(v) => onChange({ bstatus: v })} options={BROADCAST_STATUS_OPTIONS} className="w-full @4xl:w-40 @4xl:shrink-0" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.audience} onValueChange={(v) => onChange({ baudience: v })} options={AUDIENCE_OPTIONS} className="w-full @4xl:w-44 @4xl:shrink-0" triggerClassName="w-full bg-white" />
          <AppSelect value={filters.channel} onValueChange={(v) => onChange({ bchannel: v })} options={CHANNEL_OPTIONS} className="w-full @4xl:w-40 @4xl:shrink-0" triggerClassName="w-full bg-white" />
          <FilterResetButton active={isBroadcastFiltered(filters)} onReset={onReset} />
        </div>
      </div>
    </div>
  );
}

export default BroadcastsFiltersBar;
