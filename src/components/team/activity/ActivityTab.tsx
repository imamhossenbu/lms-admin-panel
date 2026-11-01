"use client";

import React, { useMemo } from "react";
import { History } from "lucide-react";
import type { TeamSeed } from "@/types/team";
import { useUrlParams } from "@/lib/useUrlParams";
import { ListFilters } from "@/components/ui/ListFilters";
import { TablePagination } from "@/components/ui/TablePagination";
import { TeamEmptyState } from "../shared/TeamEmptyState";
import { ACTIVITY_GROUPS, filterEvents, parseActivityGroup } from "./activityMeta";
import { ActivityTimeline } from "./ActivityTimeline";

const PAGE_SIZE = 15;

/** Activity tab: search + event-type filter (?q, ?type, ?page) over a day-grouped timeline. */
export function ActivityTab({ data }: { data: TeamSeed }) {
  const { get, getPage, set } = useUrlParams();
  const q = get("q");
  const group = parseActivityGroup(get("type"));
  const filtered = useMemo(() => filterEvents(data.events, group, q), [data.events, group, q]);
  const linkable = useMemo(() => new Set([...data.members.map((m) => m.id), ...data.roles.map((r) => r.id)]), [data.members, data.roles]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(getPage(), totalPages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = !!q.trim() || group !== "All";
  const reset = () => set({ q: null, type: null, page: null });

  return (
    <section className="dashboard-card shadow-2xs space-y-5 p-5">
      <ListFilters
        query={q}
        searchPlaceholder="Search activity by person, role or detail..."
        onQueryChange={(v) => set({ q: v || null, page: null })}
        selects={[{ key: "type", value: group, options: ACTIVITY_GROUPS, onChange: (v) => set({ type: v, page: null }), className: "xl:w-52" }]}
        onReset={reset}
        isFiltered={isFiltered}
      />
      {rows.length > 0 ? (
        <>
          <ActivityTimeline events={rows} linkableIds={linkable} />
          {filtered.length > PAGE_SIZE && (
            <TablePagination variant="plain" currentPage={page} pageSize={PAGE_SIZE} totalCount={filtered.length} itemLabel="events" onPageChange={(next) => set({ page: next })} />
          )}
        </>
      ) : (
        <TeamEmptyState
          icon={<History className="h-6 w-6" />}
          title={isFiltered ? "No activity matches your filters" : "No team activity yet"}
          message={isFiltered ? "Try another search or event type." : "Invitations, role changes and security events will show up here."}
          isFiltered={isFiltered}
          onReset={reset}
        />
      )}
    </section>
  );
}

export default ActivityTab;
