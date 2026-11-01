import type { TeamMember, TeamRole } from "@/types/team";

export type MemberStatusFilter = "All" | "active" | "invited" | "suspended";
export const MEMBER_STATUS_OPTIONS: { value: MemberStatusFilter; label: string }[] = [
  { value: "All", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
];

export interface MemberFilters {
  q: string;
  roleId: string;
  status: MemberStatusFilter;
}

/** URL keys owned by the Members tab (cleared together by Reset). */
export const MEMBER_FILTER_KEYS = { q: null, role: null, status: null, page: null } as const;
export const MEMBER_PAGE_SIZES = [10, 20, 50];

export const parseMemberStatus = (v: string): MemberStatusFilter => (v === "active" || v === "invited" || v === "suspended" ? v : "All");
export const isMembersFiltered = (f: MemberFilters) => !!f.q.trim() || f.roleId !== "All" || f.status !== "All";

const STATUS_RANK: Record<TeamMember["status"], number> = { ACTIVE: 0, SUSPENDED: 1, INVITED: 2 };

/** Owner first, then active → suspended → invited, then name/email. */
export function applyMemberFilters(members: TeamMember[], roles: TeamRole[], f: MemberFilters) {
  const q = f.q.trim().toLowerCase();
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? "";
  return members
    .filter((m) => f.roleId === "All" || m.roleId === f.roleId)
    .filter((m) => f.status === "All" || m.status === f.status.toUpperCase())
    .filter((m) => !q || `${m.name} ${m.email} ${roleName(m.roleId)}`.toLowerCase().includes(q))
    .sort((a, b) => Number(b.isOwner) - Number(a.isOwner) || STATUS_RANK[a.status] - STATUS_RANK[b.status] || (a.name || a.email).localeCompare(b.name || b.email));
}
