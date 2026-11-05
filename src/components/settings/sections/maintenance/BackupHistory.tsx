"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DatabaseBackup, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { apiErrorMessage } from "@/lib/apiError";
import { useCan } from "@/lib/usePermission";
import { createBackup, deleteBackup, downloadBackup, fetchBackups, type BackupItem } from "@/lib/settingsStorage";

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const formatWhen = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
const formatDay = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function BackupHistorySkeleton() {
  return (
    <div className="rounded-xl border border-dash overflow-hidden animate-pulse" aria-busy="true" aria-label="Loading backups">
      <div className="grid grid-cols-5 divide-x divide-dash bg-slate-50 border-b border-dash">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="px-3.5 py-3">
            <div className="h-3 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      {[0, 1, 2].map((r) => (
        <div key={r} className="grid grid-cols-5 divide-x divide-dash border-b border-dash last:border-b-0">
          <div className="px-3.5 py-3 space-y-1.5">
            <div className="h-3 w-28 rounded bg-slate-200" />
            <div className="h-2.5 w-16 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3">
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="px-3.5 py-3">
            <div className="h-3 w-14 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3">
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
          <div className="px-3.5 py-3 flex gap-1.5">
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Maintenance › Backups: "Back up now" and the list of stored backups (download / delete). */
export function BackupHistory() {
  const canManage = useCan("settings", "manage");
  const [items, setItems] = useState<BackupItem[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<BackupItem | null>(null);

  const load = useCallback(() => {
    fetchBackups().then(setItems, (err) => {
      setItems([]);
      toast.error("Couldn't load backups", { description: apiErrorMessage(err, "Please try again.") });
    });
  }, []);
  useEffect(load, [load]);

  const backUpNow = async () => {
    setCreating(true);
    const id = toast.loading("Backing up...", { description: "Collecting all of this workspace's data." });
    try {
      const b = await createBackup();
      setItems((prev) => [b, ...(prev ?? [])]);
      toast.success("Backup ready", { id, description: `${b.rows.toLocaleString()} records from ${b.tables} tables, ${formatSize(b.sizeBytes)}.` });
    } catch (err) {
      toast.error("Couldn't back up", { id, description: apiErrorMessage(err, "Please try again.") });
    } finally {
      setCreating(false);
    }
  };

  const download = async (b: BackupItem) => {
    setDownloading(b.id);
    const id = toast.loading("Preparing download...", { description: formatWhen(b.createdAt) });
    try {
      await downloadBackup(b);
      toast.success("Download started", { id, description: "A .json.gz file with every record (passwords and secrets are not included)." });
    } catch (err) {
      toast.error("Couldn't download the backup", { id, description: apiErrorMessage(err, "Please try again.") });
    } finally {
      setDownloading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const id = toast.loading("Deleting backup...", { description: formatWhen(deleting.createdAt) });
    try {
      await deleteBackup(deleting.id);
      setItems((prev) => (prev ?? []).filter((x) => x.id !== deleting.id));
      toast.success("Backup deleted", { id, description: formatWhen(deleting.createdAt) });
      setDeleting(null);
    } catch (err) {
      toast.error("Couldn't delete the backup", { id, description: apiErrorMessage(err, "Please try again.") });
    }
  };

  const columns: ColumnDef<BackupItem>[] = [
    {
      key: "createdAt",
      header: "Backup",
      render: (b) => (
        <span className="flex flex-col">
          <span className="body-sm-medium text-primary-500 whitespace-nowrap">{formatWhen(b.createdAt)}</span>
          <span className="body-2xsm-regular text-primary-300">{b.kind === "MANUAL" && b.createdByName ? `By ${b.createdByName}` : "Scheduled"}</span>
        </span>
      ),
    },
    {
      key: "kind",
      header: "Type",
      width: "110px",
      align: "center",
      render: (b) => (
        <ToneBadge tone={b.kind === "AUTO" ? "blue" : "purple"} size="sm">
          {b.kind === "AUTO" ? "Automatic" : "Manual"}
        </ToneBadge>
      ),
    },
    {
      key: "size",
      header: "Size",
      width: "130px",
      align: "center",
      render: (b) => (
        <span className="flex flex-col items-center">
          <span className="body-sm-medium text-primary-500">{formatSize(b.sizeBytes)}</span>
          <span className="body-2xsm-regular text-primary-300 whitespace-nowrap">{b.rows.toLocaleString()} records</span>
        </span>
      ),
    },
    {
      key: "expiresAt",
      header: "Kept until",
      width: "130px",
      align: "center",
      render: (b) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{formatDay(b.expiresAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "100px",
      align: "center",
      render: (b) => (
        <div className="flex items-center justify-center gap-1.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => void download(b)}
            disabled={!canManage || downloading === b.id}
            aria-label={`Download backup from ${formatWhen(b.createdAt)}`}
            title="Download"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white text-primary-400 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setDeleting(b)}
            disabled={!canManage}
            aria-label={`Delete backup from ${formatWhen(b.createdAt)}`}
            title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white text-red hover:bg-red-14 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="body-sm-medium text-primary-500 block">Stored backups</span>
          <span className="body-2xsm-regular text-primary-300">Every record of this workspace as a .json.gz file. Passwords, secrets and tokens are never included.</span>
        </div>
        {canManage && (
          <CardActionButton icon={creating ? <Loader2 className="animate-spin" /> : <DatabaseBackup />} onClick={() => void backUpNow()} disabled={creating}>
            {creating ? "Backing up..." : "Back up now"}
          </CardActionButton>
        )}
      </div>
      {items === null ? (
        <BackupHistorySkeleton />
      ) : (
        <DataTable columns={columns} data={items} rowKey={(b) => b.id} verticalBorders emptyMessage="No backups yet. The first automatic backup runs tonight at 2:00 AM, or back up now." />
      )}
      <p className="body-2xsm-regular text-primary-300">To restore a backup, contact EduPro support with the downloaded file.</p>

      <ConfirmModal
        isOpen={deleting !== null}
        title="Delete this backup?"
        message={deleting ? `The backup from ${formatWhen(deleting.createdAt)} will be removed for good.` : ""}
        confirmLabel="Delete Backup"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default BackupHistory;
