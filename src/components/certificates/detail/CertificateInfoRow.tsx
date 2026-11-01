import React from "react";
import type { LucideIcon } from "lucide-react";

export interface CertificateInfoRowProps {
  icon: LucideIcon;
  label: string;
  /** Hover title for the value (e.g. exact date). */
  title?: string;
  children: React.ReactNode;
}

/** One "label → value" line of the Certificate Details card. */
export function CertificateInfoRow({ icon: Icon, label, title, children }: CertificateInfoRowProps) {
  return (
    <div className="grid grid-cols-5 items-center gap-3 py-2.5">
      <dt className="col-span-2 flex items-center gap-2.5 body-sm-regular text-primary-300">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </dt>
      <dd title={title} className="col-span-3 flex min-w-0 flex-wrap items-center justify-end gap-2 text-right body-sm-medium text-primary-500">
        {children}
      </dd>
    </div>
  );
}

export default CertificateInfoRow;
