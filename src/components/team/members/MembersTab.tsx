"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Users } from "lucide-react";
import type { TeamSeed } from "@/types/team";
import { useUrlParams } from "@/lib/useUrlParams";
import { sortRoles } from "@/lib/teamStats";
import { ListFilters } from "@/components/ui/ListFilters";
import { TablePagination } from "@/components/ui/TablePagination";
import { TeamEmptyState } from "../shared/TeamEmptyState";
import type { MemberDialogOpeners } from "../shared/useMemberDialogs";
import { MembersTable } from "./MembersTable";
import { MEMBER_FILTER_KEYS, MEMBER_PAGE_SIZES, MEMBER_STATUS_OPTIONS, applyMemberFilters, isMembersFiltered, parseMemberStatus, type MemberFilters } from "./membersUtils";

export interface MembersTabProps {
  data: TeamSeed;
  open: MemberDialogOpeners;
  busyId: string | null;
  onInvite: () => void;
}

/** Members tab: search + role + status filters (?q, ?role, ?status, ?page, ?perPage) and the members table. */
export function MembersTab({ data, open, busyId, onInvite }: MembersTabProps) {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const roles = useMemo(() => sortRoles(data.roles), [data.roles]);

  const roleParam = get("role", "All");
  const q = get("q");
  const roleId = roles.some((r) => r.id === roleParam) ? roleParam : "All";
  const status = parseMemberStatus(get("status"));
  const filters: MemberFilters = useMemo(() => ({ q, roleId, status }), [q, roleId, status]);
  const perPageParam = Number(get("perPage"));
  const perPage = MEMBER_PAGE_SIZES.includes(perPageParam) ? perPageParam : MEMBER_PAGE_SIZES[0];

  const filtered = useMemo(() => applyMemberFilters(data.members, roles, filters), [data.members, roles, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(getPage(), totalPages);
  const rows = filtered.slice((page - 1) * perPage, page * perPage);
  const isFiltered = isMembersFiltered(filters);
  const reset = () => set({ ...MEMBER_FILTER_KEYS });

  const emptyMessage = isFiltered ? (
    <TeamEmptyState icon={<Users className="h-6 w-6" />} title="No members match your filters" message="Try a different name, email, role or status." isFiltered onReset={reset} />
  ) : (
    <TeamEmptyState icon={<Users className="h-6 w-6" />} title="No team members yet" message="Invite colleagues to help run the platform." actionLabel="Invite member" actionIcon={<UserPlus className="h-4 w-4" />} onAction={onInvite} />
  );

  return (
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <ListFilters
        query={filters.q}
        searchPlaceholder="Search by name, email or role..."
        onQueryChange={(v) => set({ q: v || null, page: null })}
        selects={[
          {
            key: "role",
            value: filters.roleId,
            options: [{ value: "All", label: "All roles" }, ...roles.map((r) => ({ value: r.id, label: r.name }))],
            onChange: (v) => set({ role: v, page: null }),
          },
          { key: "status", value: filters.status, options: MEMBER_STATUS_OPTIONS, onChange: (v) => set({ status: v, page: null }) },
        ]}
        onReset={reset}
        isFiltered={isFiltered}
      />
      <MembersTable
        rows={rows}
        roles={roles}
        open={{ ...open, view: (m) => router.push(`/users/${m.id}`) }}
        busyId={busyId}
        emptyMessage={emptyMessage}
        footer={
          filtered.length > 0 ? (
            <TablePagination
              currentPage={page}
              pageSize={perPage}
              totalCount={filtered.length}
              itemLabel={filtered.length === 1 ? "member" : "members"}
              onPageChange={(next) => set({ page: next })}
              onPageSizeChange={(size) => set({ perPage: size === MEMBER_PAGE_SIZES[0] ? null : size, page: null })}
              pageSizeOptions={MEMBER_PAGE_SIZES}
            />
          ) : undefined
        }
      />
    </section>
  );
}

export default MembersTab;
