"use client";

import React from "react";
import { Ban, Download, Eye, Link2, Mail, RotateCcw } from "lucide-react";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import type { IssuedRow } from "./certificateListUtils";

const ICON = "h-3.5 w-3.5 text-primary-400";

export interface IssuedRowHandlers {
  onView: (r: IssuedRow) => void;
  onDownload: (r: IssuedRow) => void;
  onEmail: (r: IssuedRow) => void;
  onCopyLink: (r: IssuedRow) => void;
  onRevoke: (r: IssuedRow) => void;
  onRestore: (r: IssuedRow) => void;
  /** Row currently being mutated (disables its mutating actions). */
  busyId: string | null;
}

/** ⋮ menu: View, Download, Email again, Copy verify link, Revoke / Restore. */
export function issuedMenuItems(r: IssuedRow, h: IssuedRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === r.id;
  const revoked = r.cert.status === "REVOKED";
  return [
    { key: "view", label: "View", icon: <Eye className={ICON} />, onClick: () => h.onView(r) },
    { key: "download", label: "Download", icon: <Download className={ICON} />, disabled: busy, onClick: () => h.onDownload(r) },
    { key: "email", label: "Email again", icon: <Mail className={ICON} />, disabled: busy || revoked, onClick: () => h.onEmail(r) },
    { key: "copy", label: "Copy verify link", icon: <Link2 className={ICON} />, onClick: () => h.onCopyLink(r) },
    revoked
      ? { key: "restore", label: "Restore", icon: <RotateCcw className={ICON} />, disabled: busy, separatorBefore: true, onClick: () => h.onRestore(r) }
      : { key: "revoke", label: "Revoke", icon: <Ban className="h-3.5 w-3.5" />, danger: true, disabled: busy, separatorBefore: true, onClick: () => h.onRevoke(r) },
  ];
}

export function IssuedRowActions({ row, handlers }: { row: IssuedRow; handlers: IssuedRowHandlers }) {
  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <RowMoreMenu size="sm" label={`More actions for ${row.cert.code}`} items={issuedMenuItems(row, handlers)} />
    </div>
  );
}

export default IssuedRowActions;
