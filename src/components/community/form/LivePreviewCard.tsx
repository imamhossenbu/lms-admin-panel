"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, Lock, Pin } from "lucide-react";
import type { ThreadFormValues } from "@/validations/communitySchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CategoryBadge } from "@/components/community/shared/CategoryBadge";
import { cn } from "@/lib/cn";
import { useCourseCatalog, useCourseContext } from "@/lib/courseCatalog";
import { courseTitle, excerpt, moduleTitle } from "./threadFormUtils";

export interface LivePreviewCardProps {
  /** Shown as "by {authorName}". */
  authorName?: string;
}

/** How the discussion will look in the community list, updated as you type. */
export function LivePreviewCard({ authorName = "Admin" }: LivePreviewCardProps) {
  const { control } = useFormContext<ThreadFormValues>();
  const [title, category, courseId, moduleId, bodyHtml, tags, isPinned, isLocked] = useWatch({
    control,
    name: ["title", "category", "courseId", "moduleId", "bodyHtml", "tags", "isPinned", "isLocked"],
  });
  const text = excerpt(bodyHtml ?? "");
  useCourseCatalog();
  useCourseContext(courseId || null);
  const course = courseTitle(courseId ?? "");
  const where = course ? [course, moduleTitle(courseId, moduleId) || "Course-wide"].join(" · ") : "No course selected";

  return (
    <IconSectionCard icon={<Eye className="h-5 w-5" />} title="Live Preview" description="How it appears in the discussion list." tone="green">
      <motion.div layout transition={{ duration: 0.2, ease: "easeOut" }} className={cn("rounded-xl border p-4", isPinned ? "border-brand-orange/30 bg-brand-orange-light" : "border-dash bg-white")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={category ?? "QUESTION"} />
          {isPinned && (
            <ToneBadge tone="orange" size="sm" icon={<Pin className="h-3 w-3" />}>
              Pinned
            </ToneBadge>
          )}
          {isLocked && (
            <ToneBadge tone="gray" size="sm" icon={<Lock className="h-3 w-3" />}>
              Locked
            </ToneBadge>
          )}
        </div>
        <p className={cn("mt-2.5 body-md-medium font-semibold! break-words", title?.trim() ? "text-primary-500" : "text-primary-300")}>
          {title?.trim() || "Your discussion title"}
        </p>
        <p className={cn("mt-1 body-xsm-regular line-clamp-3 break-words", text ? "text-primary-400" : "text-primary-300")}>
          {text || "A short excerpt of the body will show here."}
        </p>
        <p className="mt-2.5 body-xsm-medium text-primary-300 truncate">{where}</p>
        {tags && tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <ToneBadge key={t} tone="gray" size="sm">
                #{t}
              </ToneBadge>
            ))}
          </div>
        )}
        <p className="mt-3 border-t border-dash pt-2.5 body-xsm-regular text-primary-300">
          by <span className="body-xsm-medium text-primary-400">{authorName}</span> · just now
        </p>
      </motion.div>
    </IconSectionCard>
  );
}

export default LivePreviewCard;
