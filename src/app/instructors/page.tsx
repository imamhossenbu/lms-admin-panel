"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { InstructorHeader } from "@/components/instructors/InstructorHeader";
import { InstructorToolbar } from "@/components/instructors/InstructorToolbar";
import { InstructorTable } from "@/components/instructors/InstructorTable";
import { InstructorSkeleton } from "@/components/instructors/InstructorSkeleton";
import { TablePagination } from "@/components/ui/TablePagination";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage } from "@/lib/apiError";
import { useCan } from "@/lib/usePermission";
import { useUrlParams } from "@/lib/useUrlParams";
import { toInstructorItem } from "@/lib/instructors/instructorView";
import { downloadInstructorsCsv } from "@/lib/instructors/instructorCsv";
import type { InstructorListItem, InstructorListQuery, InstructorStatusLabel } from "@/types/instructorApi";

const STATUSES: InstructorStatusLabel[] = ["Active", "Inactive"];
const JOINED = ["7", "30", "90"];
const PAGE_SIZES = [10, 20, 50];

/** Instructors list: server-side search, filters and pagination, all kept in the URL. */
function InstructorsContent() {
  const router = useRouter();
  const url = useUrlParams();
  const canManage = useCan("instructors", "manage");

  const page = url.getPage();
  const status = url.get("status", "All");
  const expertise = url.get("expertise", "All");
  const joined = url.get("joined", "All");
  const limit = PAGE_SIZES.includes(Number(url.get("limit"))) ? Number(url.get("limit")) : 10;
  const urlQuery = url.get("q");

  // `set` changes identity with every URL change; effects read the latest one through a ref.
  const setParams = useRef(url.set);
  useEffect(() => {
    setParams.current = url.set;
  }, [url.set]);

  const [search, setSearch] = useState(urlQuery);
  const [result, setResult] = useState<{ rows: InstructorListItem[]; total: number; key: string } | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (search.trim() === urlQuery) return;
    const t = setTimeout(() => setParams.current({ q: search.trim(), page: 1 }), 300);
    return () => clearTimeout(t);
  }, [search, urlQuery]);

  useEffect(() => {
    instructorsApi
      .expertiseOptions()
      .then(setExpertiseOptions)
      .catch(() => setExpertiseOptions([]));
  }, []);

  const query = useMemo<InstructorListQuery>(
    () => ({
      page,
      limit,
      q: urlQuery || undefined,
      status: STATUSES.includes(status as InstructorStatusLabel) ? (status as InstructorStatusLabel) : undefined,
      expertise: expertise !== "All" ? expertise : undefined,
      joinedWithinDays: JOINED.includes(joined) ? (Number(joined) as 7 | 30 | 90) : undefined,
    }),
    [page, limit, urlQuery, status, expertise, joined]
  );
  const queryKey = JSON.stringify(query);
  const isFetching = result?.key !== queryKey && failedKey !== queryKey;

  useEffect(() => {
    let alive = true;
    const key = JSON.stringify(query);
    instructorsApi
      .list(query)
      .then((res) => {
        if (!alive) return;
        setResult({ rows: res.data, total: res.meta.total, key });
        if (res.meta.page > res.meta.totalPages) setParams.current({ page: res.meta.totalPages });
      })
      .catch((err) => {
        if (!alive) return;
        setFailedKey(key);
        setResult((r) => r ?? { rows: [], total: 0, key: "" });
        toast.error("Couldn't load instructors", { id: "instructors-load", description: apiErrorMessage(err) });
      });
    return () => {
      alive = false;
    };
  }, [query]);

  const rows = useMemo(() => (result?.rows ?? []).map((i, idx) => toInstructorItem(i, (page - 1) * limit + idx)), [result, page, limit]);

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Preparing export...", { description: "Collecting every instructor that matches the filters" });
    try {
      const all: InstructorListItem[] = [];
      for (let p = 1; ; p++) {
        const res = await instructorsApi.list({ ...query, page: p, limit: 100 });
        all.push(...res.data);
        if (p >= res.meta.totalPages) break;
      }
      downloadInstructorsCsv(all);
      toast.success("Export ready", { id: toastId, description: `${all.length} instructor record${all.length === 1 ? "" : "s"} downloaded as CSV.` });
    } catch (err) {
      toast.error("Couldn't export instructors", { id: toastId, description: apiErrorMessage(err) });
    } finally {
      setIsExporting(false);
    }
  };

  if (!result) return <InstructorSkeleton />;

  const filtered = !!(query.q || query.status || query.expertise || query.joinedWithinDays);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-4 text-left pb-8">
      <InstructorHeader onAddClick={() => router.push("/instructors/create")} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        <InstructorToolbar
          searchQuery={search}
          onSearchChange={setSearch}
          statusFilter={status}
          onStatusChange={(s) => url.set({ status: s, page: 1 })}
          expertiseFilter={expertise}
          onExpertiseChange={(e) => url.set({ expertise: e, page: 1 })}
          dateFilter={joined}
          onDateChange={(d) => url.set({ joined: d, page: 1 })}
          expertiseOptions={expertiseOptions}
          onExport={handleExport}
          isExporting={isExporting}
        />

        <InstructorTable
          instructors={rows}
          isLoading={isFetching && rows.length === 0}
          emptyMessage={filtered ? "No instructors match these filters." : "No instructors yet — add your first instructor."}
          canEdit={canManage}
          onViewDetails={(i) => router.push(`/instructors/${i.id}`)}
          onEdit={(i) => router.push(`/instructors/${i.id}/edit`)}
        />

        <TablePagination
          currentPage={page}
          itemLabel="instructors"
          totalCount={result.total}
          pageSize={limit}
          pageSizeOptions={PAGE_SIZES}
          onPageChange={(p) => url.set({ page: p })}
          onPageSizeChange={(size) => url.set({ limit: size === 10 ? null : size, page: 1 })}
        />
      </div>
    </motion.div>
  );
}

export default function InstructorsPage() {
  return (
    <Suspense fallback={<InstructorSkeleton />}>
      <InstructorsContent />
    </Suspense>
  );
}
