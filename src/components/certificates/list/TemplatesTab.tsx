"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { CertificateData } from "@/lib/certificateStorage";
import type { CertificateTemplate, TemplateStatus } from "@/types/certificate";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TemplateCard } from "./TemplateCard";
import { NewTemplateCard } from "./NewTemplateCard";
import type { TemplateHandlers } from "./TemplateRowMenu";
import type { CertificateListActions } from "./useCertificateListActions";

const STATUS_ORDER: Record<TemplateStatus, number> = { ACTIVE: 0, DRAFT: 1, ARCHIVED: 2 };

/** Templates tab: responsive grid of template cards + a dashed "New Template" tile. */
export function TemplatesTab({ data, actions }: { data: CertificateData; actions: CertificateListActions }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<CertificateTemplate | null>(null);

  const cards = useMemo(
    () =>
      data.templates
        .map((template) => {
          const u = data.overview.templateUsage.find((x) => x.templateId === template.id);
          return { template, issued: u?.issued ?? 0, lastIssuedAt: u?.lastIssuedAt ?? null, sample: null };
        })
        .sort((a, b) => STATUS_ORDER[a.template.status] - STATUS_ORDER[b.template.status] || b.template.updatedAt.localeCompare(a.template.updatedAt)),
    [data.templates, data.overview.templateUsage]
  );

  const handlers: TemplateHandlers = {
    busyId: actions.busyId,
    onEdit: (t) => router.push(`/certificates/templates/${t.id}/edit`),
    onDuplicate: actions.duplicate,
    onActivate: (t) => actions.setTemplateStatus(t, "ACTIVE"),
    onArchive: (t) => actions.setTemplateStatus(t, "ARCHIVED"),
    onDelete: setDeleting,
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {cards.map((c, i) => (
            <TemplateCard key={c.template.id} template={c.template} issued={c.issued} sample={c.sample} handlers={handlers} index={i} />
          ))}
        </AnimatePresence>
        <NewTemplateCard onClick={() => router.push("/certificates/templates/new")} />
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Template"
        subtitle={deleting ? `“${deleting.name}”` : undefined}
        message="Templates that already issued certificates can't be deleted — archive them instead. This action cannot be undone."
        confirmLabel="Delete Template"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          // Blocked deletes show their error toast; close either way.
          if (deleting) await actions.removeTemplate(deleting).catch(() => undefined);
        }}
      />
    </>
  );
}

export default TemplatesTab;
