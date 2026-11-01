import React from "react";
import { File } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** "Allowed File Types": extension chips + maximum file size. */
export function AllowedFileTypesCard({ types, maxSizeMb }: { types: string[]; maxSizeMb: number }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dash p-4">
      <File className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
      <div className="min-w-0 flex-1">
        <h4 className="body-sm-medium font-semibold! text-primary-500">Allowed File Types</h4>
        <p className="mt-0.5 body-xsm-regular text-primary-300">
          {types.length ? "You can upload the following file types:" : "Any file type can be uploaded."}
        </p>
        {types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((t) => (
              <ToneBadge key={t} tone="gray" size="sm">
                {t}
              </ToneBadge>
            ))}
          </div>
        )}
        <p className="mt-3 body-xsm-regular text-primary-300">
          Maximum file size: <span className="body-xsm-medium text-primary-500">{maxSizeMb} MB</span>
        </p>
      </div>
    </div>
  );
}

export default AllowedFileTypesCard;
