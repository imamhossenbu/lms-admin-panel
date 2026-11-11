"use client";

import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Eye, Inbox, Mail, MailCheck, Reply, Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { websiteApi } from "@/lib/api/website";
import { useCan } from "@/lib/usePermission";
import { useUrlParams } from "@/lib/useUrlParams";
import type { ContactMessage, MessageStatus } from "@/types/website";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { TablePagination } from "@/components/ui/TablePagination";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { ListToolbar } from "../shared/ListToolbar";
import { TableSkeleton } from "../shared/TableSkeleton";
import { usePagedList } from "../shared/usePagedList";
import { MessageModal } from "./MessageModal";
import { MESSAGE_FILTERS, MESSAGE_STATUS, MESSAGE_TOPIC, fmtDate } from "./messageMeta";

const PAGE_SIZES = [10, 20, 50];

/** Messages tab: contact-form messages from the academy site — search, status filter, open / reply / archive / delete. */
export function MessagesTab({ onUnread }: { onUnread: (n: number) => void }) {
  const canManage = useCan("settings", "manage");
  const { get, getPage, set } = useUrlParams();
  const q = get("q");
  const status = get("status", "All");
  const perPageParam = Number(get("perPage"));
  const perPage = PAGE_SIZES.includes(perPageParam) ? perPageParam : PAGE_SIZES[0];
  const page = getPage();
  const onQuery = useCallback((v: string) => set({ q: v || null, page: null }), [set]);
  const list = usePagedList(() => websiteApi.messages({ q, status, page, limit: perPage }), JSON.stringify({ q, status, page, perPage }));
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);

  const unread = list.data?.stats.unread;
  React.useEffect(() => {
    if (unread !== undefined) onUnread(unread);
  }, [unread, onUnread]);

  const changeStatus = async (m: ContactMessage, next: MessageStatus, quiet = false) => {
    const id = quiet ? undefined : toast.loading("Updating message…");
    try {
      await websiteApi.setMessageStatus(m.id, next);
      if (id) toast.success(`Marked as ${MESSAGE_STATUS[next].label.toLowerCase()}`, { id, description: `Message from ${m.name}.` });
      list.reload();
    } catch (e) {
      toast.error("Couldn't update the message", { id, description: apiErrorMessage(e) });
    }
  };

  const view = (m: ContactMessage) => {
    setOpen(m);
    if (m.status === "NEW" && canManage) void changeStatus(m, "READ", true);
  };
  const reply = (m: ContactMessage) => {
    window.location.href = `mailto:${m.email}?subject=${encodeURIComponent(`Re: your message to us`)}`;
    if (canManage && m.status !== "REPLIED") void changeStatus(m, "REPLIED", true);
    setOpen(null);
  };

  const columns: ColumnDef<ContactMessage>[] = [
    {
      key: "from",
      header: "From",
      width: "220px",
      render: (m) => (
        <div className="min-w-0">
          <p className={`truncate body-sm-medium text-primary-500 ${m.status === "NEW" ? "font-semibold" : ""}`}>{m.name}</p>
          <p className="truncate body-xsm-regular text-primary-300">{m.email}</p>
        </div>
      ),
    },
    { key: "topic", header: "Topic", width: "112px", render: (m) => <ToneBadge tone={MESSAGE_TOPIC[m.topic].tone} size="sm">{MESSAGE_TOPIC[m.topic].label}</ToneBadge> },
    { key: "message", header: "Message", render: (m) => <p className="truncate body-sm-regular text-primary-400" title={m.message}>{m.message}</p> },
    { key: "received", header: "Received", width: "116px", render: (m) => <span className="body-sm-regular text-primary-400">{fmtDate(m.createdAt)}</span> },
    { key: "status", header: "Status", width: "104px", align: "center", render: (m) => <ToneBadge tone={MESSAGE_STATUS[m.status].tone} size="sm" dot>{MESSAGE_STATUS[m.status].label}</ToneBadge> },
    {
      key: "actions",
      header: "Actions",
      width: "72px",
      align: "center",
      render: (m) => (
        <div onClick={(e) => e.stopPropagation()}>
          <RowMoreMenu
            items={[
              { key: "view", label: "Open", icon: <Eye className="h-4 w-4" />, onClick: () => view(m) },
              { key: "reply", label: "Reply by email", icon: <Reply className="h-4 w-4" />, onClick: () => reply(m) },
              ...(canManage
                ? [
                    m.status === "NEW"
                      ? { key: "read", label: "Mark as read", icon: <MailCheck className="h-4 w-4" />, onClick: () => void changeStatus(m, "READ") }
                      : { key: "unread", label: "Mark as new", icon: <Mail className="h-4 w-4" />, onClick: () => void changeStatus(m, "NEW") },
                    m.status === "ARCHIVED"
                      ? { key: "unarchive", label: "Move to inbox", icon: <ArchiveRestore className="h-4 w-4" />, onClick: () => void changeStatus(m, "READ") }
                      : { key: "archive", label: "Archive", icon: <Archive className="h-4 w-4" />, onClick: () => void changeStatus(m, "ARCHIVED") },
                    { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, danger: true, separatorBefore: true, onClick: () => setDeleting(m) },
                  ]
                : []),
            ]}
          />
        </div>
      ),
    },
  ];

  const filtered = !!q || status !== "All";
  const reset = () => set({ q: null, status: null, page: null });

  return (
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <ListToolbar
        query={q}
        onQuery={onQuery}
        status={status}
        statusOptions={MESSAGE_FILTERS}
        onStatus={(v) => set({ status: v === "All" ? null : v, page: null })}
        placeholder="Search name, email or message..."
        filtered={filtered}
        onReset={reset}
      />
      {list.error && !list.data ? (
        <LoadErrorCard title="Couldn't load messages" message={list.error} onRetry={list.reload} />
      ) : !list.data ? (
        <TableSkeleton cols={6} rows={Math.min(perPage, 8)} />
      ) : (
        <div className={`overflow-hidden rounded-lg border border-dash transition-opacity ${list.loading ? "opacity-60" : ""}`}>
          <DataTable
            columns={columns}
            data={list.data.data}
            rowKey={(m) => m.id}
            onRowClick={view}
            verticalBorders
            containerClassName="border-0 rounded-none"
            headerClassName="bg-slate-50 border-b border-dash"
            tableClassName="table-fixed"
            minWidth="min-w-200"
            thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
            cellClassName="px-3.5 py-3"
            emptyMessage={
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
                  <Inbox className="h-6 w-6" />
                </span>
                <p className="mt-3 body-medium font-semibold text-primary-500">{filtered ? "No messages match your filters" : "No messages yet"}</p>
                <p className="mt-1 body-sm-regular text-primary-300">{filtered ? "Try a different search or status." : "Messages sent from your website's Contact page show up here."}</p>
              </div>
            }
          />
          {list.data.pagination.total > 0 && (
            <TablePagination
              currentPage={Math.min(page, list.data.pagination.totalPages)}
              pageSize={perPage}
              totalCount={list.data.pagination.total}
              itemLabel="messages"
              onPageChange={(p) => set({ page: p })}
              onPageSizeChange={(s) => set({ perPage: s === PAGE_SIZES[0] ? null : s, page: null })}
              pageSizeOptions={PAGE_SIZES}
            />
          )}
        </div>
      )}

      <MessageModal
        message={open}
        canManage={canManage}
        onClose={() => setOpen(null)}
        onReply={reply}
        onArchive={(m) => {
          setOpen(null);
          void changeStatus(m, "ARCHIVED");
        }}
        onDelete={(m) => {
          setOpen(null);
          setDeleting(m);
        }}
      />
      <ConfirmModal
        isOpen={!!deleting}
        title="Delete message"
        subtitle={deleting ? `From ${deleting.name}` : undefined}
        message="The message will be removed permanently. This can't be undone."
        confirmLabel="Delete message"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          const id = toast.loading("Deleting message…");
          try {
            await websiteApi.removeMessage(deleting.id);
            toast.success("Message deleted", { id, description: `From ${deleting.name}.` });
            setDeleting(null);
            list.reload();
          } catch (e) {
            toast.error("Couldn't delete the message", { id, description: apiErrorMessage(e) });
          }
        }}
      />
    </section>
  );
}

export default MessagesTab;
