"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, Download, Loader2, MailMinus, MailPlus, Trash2, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { websiteApi } from "@/lib/api/website";
import { useCan } from "@/lib/usePermission";
import { useUrlParams } from "@/lib/useUrlParams";
import type { Subscriber, SubscriberStatus } from "@/types/website";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { ListToolbar } from "../shared/ListToolbar";
import { TableSkeleton } from "../shared/TableSkeleton";
import { usePagedList } from "../shared/usePagedList";
import { fmtDate } from "../messages/messageMeta";

const PAGE_SIZES = [10, 20, 50];
const FILTERS = [
  { value: "All", label: "All statuses" },
  { value: "SUBSCRIBED", label: "Subscribed" },
  { value: "UNSUBSCRIBED", label: "Unsubscribed" },
];
const SOURCE_LABEL: Record<string, string> = { home: "Home page", footer: "Footer", about: "About page", website: "Website" };

/** Subscribers tab: stats, search + status filter, CSV export, unsubscribe / re-subscribe / delete. */
export function SubscribersTab() {
  const canManage = useCan("settings", "manage");
  const { get, getPage, set } = useUrlParams();
  const q = get("q");
  const status = get("status", "All");
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];
  const page = getPage();
  const onQuery = useCallback((v: string) => set({ q: v || null, page: null }), [set]);
  const list = usePagedList(() => websiteApi.subscribers({ q, status, page, limit: perPage }), JSON.stringify({ q, status, page, perPage }));
  const [deleting, setDeleting] = useState<Subscriber | null>(null);
  const [exporting, setExporting] = useState(false);

  const setStatus = async (s: Subscriber, next: SubscriberStatus) => {
    const id = toast.loading(next === "UNSUBSCRIBED" ? "Unsubscribing…" : "Re-subscribing…");
    try {
      await websiteApi.setSubscriberStatus(s.id, next);
      toast.success(next === "UNSUBSCRIBED" ? "Unsubscribed" : "Subscribed again", { id, description: s.email });
      list.reload();
    } catch (e) {
      toast.error("Couldn't update the subscriber", { id, description: apiErrorMessage(e) });
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    const id = toast.loading("Preparing CSV…");
    try {
      const blob = await websiteApi.exportSubscribers({ q, status });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv` });
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded", { id, description: "Open it in Excel or import it into your email tool." });
    } catch (e) {
      toast.error("Couldn't export subscribers", { id, description: apiErrorMessage(e) });
    } finally {
      setExporting(false);
    }
  };

  const columns: ColumnDef<Subscriber>[] = [
    {
      key: "email",
      header: "Subscriber",
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate body-sm-medium text-primary-500">{s.email}</p>
          {s.name && <p className="truncate body-xsm-regular text-primary-300">{s.name}</p>}
        </div>
      ),
    },
    { key: "source", header: "Signed up from", width: "140px", render: (s) => <ToneBadge tone="gray" size="sm">{SOURCE_LABEL[s.source] ?? s.source}</ToneBadge> },
    { key: "date", header: "Subscribed on", width: "130px", render: (s) => <span className="body-sm-regular text-primary-400">{fmtDate(s.createdAt)}</span> },
    { key: "status", header: "Status", width: "124px", align: "center", render: (s) => <ToneBadge tone={s.status === "SUBSCRIBED" ? "green" : "gray"} size="sm" dot>{s.status === "SUBSCRIBED" ? "Subscribed" : "Unsubscribed"}</ToneBadge> },
    {
      key: "actions",
      header: "Actions",
      width: "72px",
      align: "center",
      render: (s) => (
        <RowMoreMenu
          items={[
            { key: "copy", label: "Copy email", icon: <Copy className="h-4 w-4" />, onClick: () => void navigator.clipboard.writeText(s.email).then(() => toast.success("Email copied", { description: s.email })) },
            ...(canManage
              ? [
                  s.status === "SUBSCRIBED"
                    ? { key: "unsub", label: "Unsubscribe", icon: <MailMinus className="h-4 w-4" />, onClick: () => void setStatus(s, "UNSUBSCRIBED") }
                    : { key: "resub", label: "Subscribe again", icon: <MailPlus className="h-4 w-4" />, onClick: () => void setStatus(s, "SUBSCRIBED") },
                  { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, danger: true, separatorBefore: true, onClick: () => setDeleting(s) },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  const stats = list.data?.stats;
  const filtered = !!q || status !== "All";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <TrendStatCard icon={<Users />} iconClassName="bg-blue-14 text-blue" label="Total sign-ups" value={stats ? stats.total.toLocaleString("en-US") : "—"} />
        <TrendStatCard icon={<UserCheck />} iconClassName="bg-green-bg text-green" label="Subscribed" value={stats ? stats.subscribed.toLocaleString("en-US") : "—"} />
        <TrendStatCard icon={<UserMinus />} iconClassName="bg-red-14 text-red" label="Unsubscribed" value={stats ? stats.unsubscribed.toLocaleString("en-US") : "—"} />
        <TrendStatCard icon={<UserPlus />} iconClassName="bg-brand-orange-light text-brand-orange" label="New in 30 days" value={stats ? stats.last30Days.toLocaleString("en-US") : "—"} />
      </div>

      <section className="dashboard-card shadow-2xs space-y-4 p-5">
        <ListToolbar
          query={q}
          onQuery={onQuery}
          status={status}
          statusOptions={FILTERS}
          onStatus={(v) => set({ status: v === "All" ? null : v, page: null })}
          placeholder="Search email or name..."
          filtered={filtered}
          onReset={() => set({ q: null, status: null, page: null })}
          action={
            <motion.button type="button" whileTap={{ scale: 0.96 }} disabled={exporting || !stats?.total} onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 transition-colors hover:border-primary-300 disabled:opacity-50">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export CSV
            </motion.button>
          }
        />
        {list.error && !list.data ? (
          <LoadErrorCard title="Couldn't load subscribers" message={list.error} onRetry={list.reload} />
        ) : !list.data ? (
          <TableSkeleton cols={5} rows={Math.min(perPage, 8)} />
        ) : (
          <div className={`overflow-hidden rounded-lg border border-dash transition-opacity ${list.loading ? "opacity-60" : ""}`}>
            <DataTable
              columns={columns}
              data={list.data.data}
              rowKey={(s) => s.id}
              verticalBorders
              containerClassName="border-0 rounded-none"
              headerClassName="bg-slate-50 border-b border-dash"
              tableClassName="table-fixed"
              minWidth="min-w-170"
              thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
              cellClassName="px-3.5 py-3"
              emptyMessage={
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
                    <Users className="h-6 w-6" />
                  </span>
                  <p className="mt-3 body-medium font-semibold text-primary-500">{filtered ? "No subscribers match your filters" : "No subscribers yet"}</p>
                  <p className="mt-1 body-sm-regular text-primary-300">{filtered ? "Try a different search or status." : "People who sign up on your website's newsletter form appear here."}</p>
                </div>
              }
            />
            {list.data.pagination.total > 0 && (
              <TablePagination
                currentPage={Math.min(page, list.data.pagination.totalPages)}
                pageSize={perPage}
                totalCount={list.data.pagination.total}
                itemLabel="subscribers"
                onPageChange={(p) => set({ page: p })}
                onPageSizeChange={(s) => set({ perPage: s === PAGE_SIZES[0] ? null : s, page: null })}
                pageSizeOptions={PAGE_SIZES}
              />
            )}
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete subscriber"
        subtitle={deleting?.email}
        message="They'll be removed from your list. If they sign up again they'll be added back."
        confirmLabel="Delete subscriber"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          const id = toast.loading("Deleting subscriber…");
          try {
            await websiteApi.removeSubscriber(deleting.id);
            toast.success("Subscriber deleted", { id, description: deleting.email });
            setDeleting(null);
            list.reload();
          } catch (e) {
            toast.error("Couldn't delete the subscriber", { id, description: apiErrorMessage(e) });
          }
        }}
      />
    </div>
  );
}

export default SubscribersTab;
