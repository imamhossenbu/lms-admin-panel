"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link2, Pencil, Trash2 } from "lucide-react";
import type { LessonResourceLink } from "@/validations/lessonFormSchema";
import { ResourceRowActionButton } from "./ResourceRowActionButton";

interface ResourceLinkRowProps {
  link: LessonResourceLink;
  onEdit: () => void;
  onDelete: () => void;
}

/** External link row: link icon, title, URL, edit (pencil) + delete (red trash). */
export function ResourceLinkRow({ link, onEdit, onDelete }: ResourceLinkRowProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border border-dash bg-white px-4 py-3"
    >
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
        <Link2 className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium text-primary-500 truncate" title={link.title}>
          {link.title}
        </p>
        <p className="body-xsm-regular text-primary-300 mt-0.5 truncate" title={link.url}>
          {link.url}
        </p>
      </div>
      <ResourceRowActionButton label={`Edit ${link.title}`} onClick={onEdit}>
        <Pencil />
      </ResourceRowActionButton>
      <ResourceRowActionButton label={`Delete ${link.title}`} tone="danger" onClick={onDelete}>
        <Trash2 />
      </ResourceRowActionButton>
    </motion.li>
  );
}

export default ResourceLinkRow;
