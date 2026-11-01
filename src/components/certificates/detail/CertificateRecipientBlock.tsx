import React from "react";
import type { CertificateRecipient } from "@/types/certificate";
import { initialsOf } from "@/lib/certificateStats";

export interface CertificateRecipientBlockProps {
  recipient: CertificateRecipient;
}

/** Avatar initials + learner name + email (top of the Certificate Details card). */
export function CertificateRecipientBlock({ recipient }: CertificateRecipientBlockProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dash bg-gray-bg p-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange-light body-sm-medium font-semibold! text-brand-orange">
        {initialsOf(recipient.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate body-sm-medium font-semibold! text-primary-500">{recipient.name}</p>
        <a href={`mailto:${recipient.email}`} className="block truncate body-xsm-regular text-primary-300 transition-colors hover:text-brand-orange">
          {recipient.email}
        </a>
      </div>
    </div>
  );
}

export default CertificateRecipientBlock;
