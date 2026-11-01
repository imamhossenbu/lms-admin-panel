import React from "react";
import { Paperclip } from "lucide-react";
import type { AssignmentAttachment } from "@/types/assignment";
import { ToneBadge } from "@/components/ui/ToneBadge";

const size = (bytes: number) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/** Downloadable resources attached by the instructor. */
export function PreviewAttachments({ attachments }: { attachments: AssignmentAttachment[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {attachments.map((file) => (
        <li key={file.id}>
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-dash p-3 transition-colors hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
              <Paperclip className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate body-sm-medium text-primary-500">{file.name}</span>
              <span className="body-xsm-regular text-primary-300">{size(file.size)}</span>
            </span>
            <ToneBadge tone="gray" size="sm">
              {file.format}
            </ToneBadge>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default PreviewAttachments;
