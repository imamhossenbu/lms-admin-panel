import React from "react";
import type { CertificateRecipient, IssueMethod } from "@/types/certificate";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatShortDate } from "./certificateListUtils";

/** Monospace-ish code on top, template name below. */
export function CertificateCodeCell({ code, templateName }: { code: string; templateName: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate body-sm-medium font-semibold! text-primary-500 tabular-nums" title={code}>
        {code}
      </p>
      <p className="truncate body-xsm-regular text-primary-300" title={templateName}>
        {templateName}
      </p>
    </div>
  );
}

/** Initials avatar + name + email. */
export function RecipientCell({ recipient }: { recipient: CertificateRecipient }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={recipient.name} size={30} />
      <div className="min-w-0">
        <p className="truncate body-sm-medium text-primary-500" title={recipient.name}>
          {recipient.name}
        </p>
        <p className="truncate body-xsm-regular text-primary-300" title={recipient.email}>
          {recipient.email}
        </p>
      </div>
    </div>
  );
}

/** Issued date + Auto / Manual. */
export function IssuedDateCell({ iso, method }: { iso: string; method: IssueMethod }) {
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-regular text-primary-500">{formatShortDate(iso)}</p>
      <p className="body-xsm-regular text-primary-300">{method === "AUTO" ? "Auto-issued" : "Manual"}</p>
    </div>
  );
}

/** "Never" / date; yellow pill when it expires within 30 days. */
export function ExpiresCell({ iso, soon }: { iso: string | null; soon: boolean }) {
  if (!iso) return <span className="body-sm-regular text-primary-300">Never</span>;
  if (soon)
    return (
      <ToneBadge tone="yellow" size="sm">
        {formatShortDate(iso)}
      </ToneBadge>
    );
  return <span className="whitespace-nowrap body-sm-regular text-primary-500">{formatShortDate(iso)}</span>;
}

export function GradeCell({ grade }: { grade: number | null }) {
  return <span className="body-sm-regular text-primary-500 tabular-nums">{grade === null ? "—" : `${grade}%`}</span>;
}

export default CertificateCodeCell;
