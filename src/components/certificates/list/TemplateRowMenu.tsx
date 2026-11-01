"use client";

import React from "react";
import { Archive, CheckCircle2, Copy, Pencil, Trash2 } from "lucide-react";
import type { CertificateTemplate } from "@/types/certificate";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";

const ICON = "h-3.5 w-3.5 text-primary-400";

export interface TemplateHandlers {
  onEdit: (t: CertificateTemplate) => void;
  onDuplicate: (t: CertificateTemplate) => void;
  onActivate: (t: CertificateTemplate) => void;
  onArchive: (t: CertificateTemplate) => void;
  onDelete: (t: CertificateTemplate) => void;
  busyId: string | null;
}

/** ⋮ menu on a template card: Edit, Duplicate, Activate / Archive, Delete. */
export function TemplateRowMenu({ template, handlers }: { template: CertificateTemplate; handlers: TemplateHandlers }) {
  const busy = handlers.busyId === template.id;
  const items: DropdownActionItem[] = [
    { key: "edit", label: "Edit", icon: <Pencil className={ICON} />, onClick: () => handlers.onEdit(template) },
    { key: "duplicate", label: "Duplicate", icon: <Copy className={ICON} />, disabled: busy, onClick: () => handlers.onDuplicate(template) },
  ];
  if (template.status !== "ACTIVE") items.push({ key: "activate", label: "Activate", icon: <CheckCircle2 className={ICON} />, disabled: busy, onClick: () => handlers.onActivate(template) });
  if (template.status !== "ARCHIVED") items.push({ key: "archive", label: "Archive", icon: <Archive className={ICON} />, disabled: busy, onClick: () => handlers.onArchive(template) });
  items.push({ key: "delete", label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => handlers.onDelete(template) });
  return <RowMoreMenu size="md" label={`More actions for ${template.name}`} items={items} />;
}

export default TemplateRowMenu;
