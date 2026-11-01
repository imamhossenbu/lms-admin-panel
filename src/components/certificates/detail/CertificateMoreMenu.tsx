"use client";

import React from "react";
import { ExternalLink, Link2, MoreHorizontal, RefreshCcw, RotateCcw, ShieldOff } from "lucide-react";
import type { IssuedStatus } from "@/types/certificate";
import { AppDropdownMenu, type DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface CertificateMoreMenuProps {
  status: IssuedStatus;
  disabled?: boolean;
  onCopyLink: () => void;
  onOpenVerification: () => void;
  onReissue: () => void;
  onRevoke: () => void;
  onRestore: () => void;
}

/** Header "⋮" menu: copy / open verification link, Reissue (revoked or expired), Revoke / Restore. */
export function CertificateMoreMenu({ status, disabled, onCopyLink, onOpenVerification, onReissue, onRevoke, onRestore }: CertificateMoreMenuProps) {
  const items: DropdownActionItem[] = [
    { key: "copy", label: "Copy verification link", icon: <Link2 className="h-4 w-4" />, onClick: onCopyLink },
    { key: "open", label: "Open verification page", icon: <ExternalLink className="h-4 w-4" />, onClick: onOpenVerification },
  ];
  if (status !== "VALID") items.push({ key: "reissue", label: "Reissue", icon: <RefreshCcw className="h-4 w-4" />, onClick: onReissue, disabled });
  if (status === "VALID")
    items.push({ key: "revoke", label: "Revoke", icon: <ShieldOff className="h-4 w-4" />, onClick: onRevoke, danger: true, separatorBefore: true, disabled });
  if (status === "REVOKED")
    items.push({ key: "restore", label: "Restore", icon: <RotateCcw className="h-4 w-4" />, onClick: onRestore, separatorBefore: true, disabled });
  return (
    <AppDropdownMenu
      align="end"
      items={items}
      trigger={<SecondaryButton icon={<MoreHorizontal />} aria-label="More certificate actions" title="More actions" />}
    />
  );
}

export default CertificateMoreMenu;
