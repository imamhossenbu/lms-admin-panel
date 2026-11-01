"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, Link2 } from "lucide-react";
import type { LessonResourceFile, LessonResourceLink } from "@/validations/lessonFormSchema";
import { FileTypeIcon } from "./FileTypeIcon";
import { formatBytes, isSafeHttpUrl } from "./resourceUtils";

interface PreviewResourceItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  actionIcon: React.ReactNode;
  actionLabel: string;
}

/** One row in the Resources Preview card (opens the file / link in a new tab). */
function PreviewResourceItem({ icon, title, subtitle, href, actionIcon, actionLabel }: PreviewResourceItemProps) {
  const safe = isSafeHttpUrl(href);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border border-dash bg-white px-3.5 py-3"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium text-primary-500 truncate" title={title}>
          {title}
        </p>
        <p className="body-xsm-regular text-primary-300 mt-0.5 truncate" title={subtitle}>
          {subtitle}
        </p>
      </div>
      {safe && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={actionLabel}
          title={actionLabel}
          whileTap={{ scale: 0.92 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-slate-100 hover:text-primary-500 [&>svg]:h-4 [&>svg]:w-4"
        >
          {actionIcon}
        </motion.a>
      )}
    </motion.li>
  );
}

export function PreviewFileItem({ file }: { file: LessonResourceFile }) {
  return (
    <PreviewResourceItem
      icon={<FileTypeIcon fileType={file.fileType} size="sm" />}
      title={file.name}
      subtitle={`${formatBytes(file.size)} · ${file.fileType || "FILE"}`}
      href={file.url}
      actionIcon={<Download />}
      actionLabel={`Download ${file.name}`}
    />
  );
}

export function PreviewLinkItem({ link }: { link: LessonResourceLink }) {
  return (
    <PreviewResourceItem
      icon={
        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
          <Link2 className="h-4 w-4" />
        </span>
      }
      title={link.title}
      subtitle={link.url}
      href={link.url}
      actionIcon={<ExternalLink />}
      actionLabel={`Open ${link.title}`}
    />
  );
}
