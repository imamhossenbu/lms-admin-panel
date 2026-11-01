"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LessonSubtitle } from "@/validations/lessonEditorSchema";

export interface SubtitlesTableProps {
  rows: LessonSubtitle[];
  onToggleStatus: (index: number) => void;
  onDelete: (index: number) => void;
}

const actionClass = "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white transition-colors";

/** Subtitle list: #, Language, File Name, Status (click to toggle), Actions. */
export function SubtitlesTable({ rows, onToggleStatus, onDelete }: SubtitlesTableProps) {
  const columns: ColumnDef<LessonSubtitle>[] = [
    { key: "index", header: "#", width: "w-10", render: (_, i) => <span className="body-sm-regular text-primary-400">{i + 1}</span> },
    { key: "language", header: "Language", render: (row) => <span className="body-sm-regular text-primary-500 whitespace-nowrap">{row.language}</span> },
    { key: "fileName", header: "File Name", render: (row) => <span className="block max-w-40 truncate body-sm-regular text-primary-500" title={row.fileName}>{row.fileName}</span> },
    {
      key: "status",
      header: "Status",
      render: (row, i) => (
        <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => onToggleStatus(i)} className="cursor-pointer" title="Click to toggle status">
          <ToneBadge tone={row.status === "ACTIVE" ? "green" : "gray"}>{row.status === "ACTIVE" ? "Active" : "Inactive"}</ToneBadge>
        </motion.button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row, i) => (
        <div className="flex items-center justify-center gap-2">
          <motion.a whileTap={{ scale: 0.92 }} href={row.url} download target="_blank" rel="noopener noreferrer" aria-label={`Download ${row.fileName}`} className={`${actionClass} text-blue hover:bg-blue-14`}>
            <Download className="h-4 w-4" />
          </motion.a>
          <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => onDelete(i)} aria-label={`Delete ${row.language} subtitle`} className={`${actionClass} text-red hover:bg-red-14`}>
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={rows} rowKey={(row) => row.id} emptyMessage="No subtitles yet. Click “Add Subtitle” to upload one." cellClassName="px-3.5 py-3" />;
}

export default SubtitlesTable;
