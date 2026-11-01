"use client";

import React, { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { BackupEntry } from "@/lib/settingsStorage";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { settingsFullDate, settingsTimeAgo } from "@/components/settings/shared/settingsTime";
import { BACKUP_KIND_META, BACKUP_STATUS_META, formatSize, wait } from "./maintenanceUtils";

export interface BackupsTableProps {
  backups: BackupEntry[];
}

/** Recent backups: Date, Type, Size, Status, ⋮ (Download / Restore). */
export function BackupsTable({ backups }: BackupsTableProps) {
  const [restoring, setRestoring] = useState<BackupEntry | null>(null);

  const download = async (b: BackupEntry) => {
    const id = toast.loading("Preparing download...", { description: `Backup from ${settingsFullDate(b.at)}` });
    await wait(700);
    toast.success("Download started", { id, description: `${formatSize(b.sizeMb)} backup archive (demo).` });
  };

  const restore = async () => {
    if (!restoring) return;
    const id = toast.loading("Starting restore...", { description: `Backup from ${settingsFullDate(restoring.at)}` });
    await wait(900);
    toast.success("Restore started", { id, description: "We'll notify you when the platform is back to that point (demo)." });
  };

  const columns: ColumnDef<BackupEntry>[] = [
    {
      key: "at",
      header: "Date",
      width: "34%",
      render: (b) => (
        <div className="min-w-0">
          <p className="truncate body-sm-medium text-primary-500">{settingsFullDate(b.at)}</p>
          <p className="body-xsm-regular text-primary-300">{settingsTimeAgo(b.at)}</p>
        </div>
      ),
    },
    {
      key: "kind",
      header: "Type",
      width: "16%",
      render: (b) => (
        <ToneBadge tone={BACKUP_KIND_META[b.kind].tone} size="sm">
          {BACKUP_KIND_META[b.kind].label}
        </ToneBadge>
      ),
    },
    { key: "size", header: "Size", width: "16%", render: (b) => <span className="body-sm-regular tabular-nums text-primary-400">{formatSize(b.sizeMb)}</span> },
    {
      key: "status",
      header: "Status",
      width: "20%",
      render: (b) => (
        <ToneBadge tone={BACKUP_STATUS_META[b.status].tone} size="sm" variant="pill" dot>
          {BACKUP_STATUS_META[b.status].label}
        </ToneBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "14%",
      align: "center",
      render: (b) => (
        <div className="flex justify-center">
          <RowMoreMenu
            size="sm"
            label="Backup actions"
            items={[
              { key: "download", label: "Download", icon: <Download className="h-4 w-4" />, disabled: b.status === "FAILED", onClick: () => void download(b) },
              { key: "restore", label: "Restore", icon: <RotateCcw className="h-4 w-4" />, danger: true, disabled: b.status === "FAILED", separatorBefore: true, onClick: () => setRestoring(b) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable<BackupEntry>
        columns={columns}
        data={backups}
        rowKey={(b) => b.id}
        tableClassName="table-fixed"
        minWidth="min-w-160"
        emptyMessage="No backups yet. Run your first backup to see it here."
      />
      <ConfirmModal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        title="Restore this backup?"
        subtitle="The platform will roll back to this point."
        message={
          <>
            Everything created after <span className="font-semibold">{restoring ? settingsFullDate(restoring.at) : ""}</span> (enrollments, payments, content edits) will be replaced. Students may see
            maintenance briefly while the restore runs.
          </>
        }
        confirmLabel="Restore backup"
        pendingLabel="Starting..."
        confirmIcon={<RotateCcw className="h-4 w-4" />}
        onConfirm={restore}
      />
    </>
  );
}

export default BackupsTable;
