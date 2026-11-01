"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Paperclip } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { PreviewFileItem, PreviewLinkItem } from "./PreviewResourceItem";

/** Right-panel preview of the lesson's resources (shown while the Resources tab is active). */
export function ResourcesPreviewCard() {
  const { control } = useFormContext<LessonFormValues>();
  const files = useWatch({ control, name: "resourceFiles" }) ?? [];
  const links = useWatch({ control, name: "resourceLinks" }) ?? [];
  const empty = files.length === 0 && links.length === 0;

  return (
    <section className="rounded-xl border border-dash bg-white p-5">
      <div className="flex items-start gap-3">
        <Paperclip className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
        <div className="min-w-0">
          <h4 className="title-medium text-primary-500">Resources Preview</h4>
          <p className="body-sm-regular text-primary-300 mt-0.5">These resources will be available to students.</p>
        </div>
      </div>

      {empty ? (
        <p className="mt-4 rounded-xl border border-dashed border-dash bg-slate-50 px-4 py-6 text-center body-sm-regular text-primary-300">
          No resources added yet. Uploaded files and links will appear here.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          <AnimatePresence initial={false}>
            {files.map((file) => (
              <PreviewFileItem key={`file-${file.id}`} file={file} />
            ))}
            {links.map((link) => (
              <PreviewLinkItem key={`link-${link.id}`} link={link} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

export default ResourcesPreviewCard;
