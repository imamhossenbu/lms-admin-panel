import React from "react";
import { File } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface AllowedFileTypesCardProps {
  types: string[];
  maxSizeMb: number;
  /** Max number of files per submission. */
  maxFiles?: number;
  /** false for Text / Link assignments (no uploads). */
  applicable?: boolean;
}

/** "Allowed File Types": extension chips + maximum file size and file count. */
export function AllowedFileTypesCard({ types, maxSizeMb, maxFiles, applicable = true }: AllowedFileTypesCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dash p-4">
      <File className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
      <div className="min-w-0 flex-1">
        <h4 className="body-sm-medium font-semibold! text-primary-500">Allowed File Types</h4>
        <p className="mt-0.5 body-xsm-regular text-primary-300">
          {!applicable
            ? "This assignment does not accept file uploads."
            : types.length
              ? "You can upload the following file types:"
              : "Any file type can be uploaded."}
        </p>
        {applicable && types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((t) => (
              <ToneBadge key={t} tone="gray" size="sm">
                {t}
              </ToneBadge>
            ))}
          </div>
        )}
        {applicable && (
          <div className="mt-3 space-y-0.5 body-xsm-regular text-primary-300">
            <p>
              Maximum file size: <span className="body-xsm-medium text-primary-500">{maxSizeMb} MB</span>
            </p>
            {maxFiles !== undefined && maxFiles > 0 && (
              <p>
                Maximum files: <span className="body-xsm-medium text-primary-500">{maxFiles}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllowedFileTypesCard;
