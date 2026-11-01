"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import type { CertificateSeed } from "@/data/mockCertificateData";
import { useUrlParams } from "@/lib/useUrlParams";
import { TablePagination } from "@/components/ui/TablePagination";
import { CertificatesEmptyState } from "./CertificatesEmptyState";
import { IssuedFiltersBar } from "./IssuedFiltersBar";
import { IssuedBulkBar } from "./IssuedBulkBar";
import { IssuedTable } from "./IssuedTable";
import { RevokeCertificateModal } from "./RevokeCertificateModal";
import { MonthlyIssuedCard } from "./MonthlyIssuedCard";
import { ByCourseCard } from "./ByCourseCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { filterIssued, isIssuedFiltered, toIssuedRows, type IssuedFilters, type IssuedRow } from "./certificateListUtils";
import type { IssuedRowHandlers } from "./IssuedRowActions";
import type { CertificateListActions } from "./useCertificateListActions";

const PAGE_SIZES = [10, 20, 50];
const FILTER_KEYS = { q: null, course: null, template: null, status: null, method: null, from: null, to: null, page: null } as const;

export interface IssuedTabProps {
  data: CertificateSeed;
  actions: CertificateListActions;
  onIssue: () => void;
}

/** Issued tab: URL-synced filters, bulk bar, table + pagination, then the insight cards. */
export function IssuedTab({ data, actions, onIssue }: IssuedTabProps) {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revoking, setRevoking] = useState<IssuedRow[]>([]);

  const query = get("q");
  const courseId = get("course", "All");
  const templateId = get("template", "All");
  const status = get("status", "All");
  const method = get("method", "All");
  const from = get("from");
  const to = get("to");
  const filters: IssuedFilters = useMemo(
    () => ({ query, courseId, templateId, status, method, range: { from: from || undefined, to: to || undefined } }),
    [query, courseId, templateId, status, method, from, to]
  );
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];

  const allRows = useMemo(() => toIssuedRows(data.certificates, data.templates), [data.certificates, data.templates]);
  const filtered = useMemo(() => filterIssued(allRows, filters), [allRows, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(getPage(), totalPages);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageIds = new Set(rows.map((r) => r.id));
  const selectedRows = rows.filter((r) => selectedIds.includes(r.id) && pageIds.has(r.id));
  const revocable = selectedRows.filter((r) => r.cert.status === "VALID");
  const isFiltered = isIssuedFiltered(filters);

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSelectedIds([]);
    set(updates);
  };
  const resetFilters = () => updateParams({ ...FILTER_KEYS });

  const handlers: IssuedRowHandlers = {
    busyId: actions.busyId,
    onView: (r) => router.push(`/certificates/${r.id}`),
    onDownload: actions.download,
    onEmail: actions.email,
    onCopyLink: actions.copyLink,
    onRevoke: (r) => setRevoking([r]),
    onRestore: actions.restore,
  };

  const emptyMessage = isFiltered ? (
    <CertificatesEmptyState icon={<Award className="h-6 w-6" />} title="No certificates match your filters" message="Try a different search, course, template, status, method or date range." isFiltered onReset={resetFilters} />
  ) : (
    <CertificatesEmptyState icon={<Award className="h-6 w-6" />} title="No certificates issued yet" message="Certificates appear here once learners complete a course with an active template — or issue one manually." actionLabel="Issue Certificate" onAction={onIssue} />
  );

  return (
    <div className="space-y-5">
      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <IssuedFiltersBar
          filters={filters}
          templates={data.templates}
          onChange={(u) => updateParams({ ...u, page: null })}
          onRangeChange={(r) => updateParams({ from: r.from ?? null, to: r.to ?? null, page: null })}
          onReset={resetFilters}
        />
        <IssuedBulkBar
          count={selectedRows.length}
          revocableCount={revocable.length}
          busy={actions.isBulkBusy}
          onEmail={() => void actions.bulkEmail(selectedRows.filter((r) => r.cert.status !== "REVOKED")).then(() => setSelectedIds([]))}
          onRevoke={() => setRevoking(revocable)}
          onCsv={() => actions.exportCsv(selectedRows)}
          onClear={() => setSelectedIds([])}
        />
        <IssuedTable
          rows={rows}
          handlers={handlers}
          selectedIds={selectedRows.map((r) => r.id)}
          onSelectRow={(id, checked) => setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)))}
          onSelectAll={(checked) => setSelectedIds(checked ? rows.map((r) => r.id) : [])}
          emptyMessage={emptyMessage}
          footer={
            filtered.length > 0 ? (
              <TablePagination
                currentPage={currentPage}
                pageSize={perPage}
                totalCount={filtered.length}
                itemLabel="certificates"
                onPageChange={(next) => updateParams({ page: next })}
                onPageSizeChange={(size) => updateParams({ perPage: size === PAGE_SIZES[0] ? null : size, page: null })}
                pageSizeOptions={PAGE_SIZES}
              />
            ) : undefined
          }
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <MonthlyIssuedCard certificates={data.certificates} index={0} />
        <ByCourseCard certificates={data.certificates} activeCourseId={filters.courseId} onSelect={(id) => updateParams({ course: id, page: null })} index={1} />
        <RecentActivityCard events={data.events} certificates={data.certificates} index={2} className="lg:col-span-2 2xl:col-span-1" />
      </div>

      <RevokeCertificateModal
        isOpen={revoking.length > 0}
        rows={revoking}
        onClose={() => setRevoking([])}
        onConfirm={async (reason, notify) => {
          await actions.revoke(revoking, reason, notify);
          setSelectedIds([]);
        }}
      />
    </div>
  );
}

export default IssuedTab;
