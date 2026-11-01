"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import type { LessonResourceFile } from "@/validations/lessonFormSchema";
import { FileTypeIcon } from "./FileTypeIcon";
import { ResourceRowActionButton } from "./ResourceRowActionButton";
import { formatBytes, isSafeHttpUrl } from "./resourceUtils";

interface ResourceFileRowProps {
  file: LessonResourceFile;
  onRename: () => void;
  onRemove: () => void;
}

/** Uploaded resource file: type tile, name, "2.4 MB · PDF", download + ⋮ (Rename, Remove). */
export function ResourceFileRow({ file, onRename, onRemove }: ResourceFileRowProps) {
  const openFile = () => {
    if (isSafeHttpUrl(file.url)) window.open(file.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border border-dash bg-white px-4 py-3"
    >
      <FileTypeIcon fileType={file.fileType} />
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium text-primary-500 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="body-xsm-regular text-primary-300 mt-0.5">
          {formatBytes(file.size)} · {file.fileType || "FILE"}
        </p>
      </div>
      <ResourceRowActionButton label={`Download ${file.name}`} onClick={openFile}>
        <Download />
      </ResourceRowActionButton>
      <AppDropdownMenu
        items={[
          { key: "rename", label: "Rename", icon: <Pencil className="h-4 w-4" />, onClick: onRename },
          { key: "remove", label: "Remove", icon: <Trash2 className="h-4 w-4" />, onClick: onRemove, danger: true },
        ]}
        trigger={
          <ResourceRowActionButton label={`More actions for ${file.name}`}>
            <MoreVertical />
          </ResourceRowActionButton>
        }
      />
    </motion.li>
  );
}

export default ResourceFileRow;
