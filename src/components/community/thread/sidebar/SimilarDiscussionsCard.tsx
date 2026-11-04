"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { timeAgo } from "@/lib/communityStats";
import type { RelatedThread } from "@/lib/communityStorage";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CategoryBadge } from "../../shared/CategoryBadge";
import { plural } from "../threadFormat";

export interface SimilarDiscussionsCardProps {
  related: RelatedThread[];
}

/** Top 4 discussions from the same course, ranked by shared tags then recent activity (ranked by the API). */
export function SimilarDiscussionsCard({ related }: SimilarDiscussionsCardProps) {
  const items = related.map((v) => ({ v, shared: v.sharedTags }));

  return (
    <IconSectionCard icon={<Sparkles className="h-5 w-5" />} title="Similar Discussions" description="Same course, related tags." tone="green" bodyClassName="mt-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash px-4 py-6 text-center body-sm-regular text-primary-300">No other discussions in this course yet.</p>
      ) : (
        <ul className="divide-y divide-dash">
          {items.map(({ v, shared }) => (
            <li key={v.thread.id}>
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                <Link href={`/community/${v.thread.id}`} className="group flex items-start gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 body-sm-medium text-primary-500 transition-colors group-hover:text-brand-orange">{v.thread.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 body-xsm-regular text-primary-300">
                      <CategoryBadge category={v.thread.category} />
                      <span className="whitespace-nowrap">{plural(v.replyCount, "reply", "replies")}</span>
                      <span>·</span>
                      <span className="whitespace-nowrap">{timeAgo(v.lastActivityAt)}</span>
                      {shared > 0 && (
                        <>
                          <span>·</span>
                          <span className="whitespace-nowrap">{plural(shared, "shared tag")}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary-300 transition-colors group-hover:text-brand-orange" />
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      )}
    </IconSectionCard>
  );
}

export default SimilarDiscussionsCard;
