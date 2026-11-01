"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hash, TrendingUp } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SidebarCard } from "./SidebarCard";

export interface TrendingTagsCardProps {
  tags: { tag: string; score: number }[];
  /** Currently searched tag (highlighted). */
  activeQuery: string;
  onSelect: (tag: string) => void;
  index?: number;
}

/** Most active tags over the last 30 days; clicking one searches for it. */
export function TrendingTagsCard({ tags, activeQuery, onSelect, index }: TrendingTagsCardProps) {
  const active = activeQuery.toLowerCase().replace(/^#/, "");
  return (
    <SidebarCard index={index} icon={<TrendingUp className="h-4 w-4" />} iconClassName="bg-green-bg text-green" title="Trending Tags">
      {tags.length === 0 ? (
        <p className="rounded-lg border border-dashed border-dash px-3 py-5 text-center body-sm-regular text-primary-300">No tags used in the last 30 days.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag }) => {
            const isActive = active === tag.toLowerCase();
            return (
              <motion.button key={tag} type="button" whileTap={{ scale: 0.95 }} onClick={() => onSelect(isActive ? "" : tag)} aria-pressed={isActive} className="cursor-pointer rounded-full" title={isActive ? "Clear tag search" : `Search #${tag}`}>
                <ToneBadge tone={isActive ? "orange" : "gray"} size="md" variant="pill" icon={<Hash className="h-3 w-3" />} className="transition-colors hover:border-brand-orange hover:text-brand-orange">
                  {tag}
                </ToneBadge>
              </motion.button>
            );
          })}
        </div>
      )}
    </SidebarCard>
  );
}

export default TrendingTagsCard;
