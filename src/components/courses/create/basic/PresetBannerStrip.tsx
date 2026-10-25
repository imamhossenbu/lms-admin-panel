"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { PRESET_BANNERS } from "@/components/courses/constants";

interface PresetBannerStripProps {
  value: string;
  disabled?: boolean;
  onSelect: (url: string) => void;
}

/** Row of ready-made banners, a quick alternative to uploading a thumbnail. */
export function PresetBannerStrip({ value, disabled, onSelect }: PresetBannerStripProps) {
  return (
    <div className="mt-2.5 flex items-center gap-2 min-w-0">
      <span className="body-xsm-regular text-primary-300 shrink-0">Or use a preset:</span>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {PRESET_BANNERS.map((banner) => {
          const isSelected = banner.url === value;
          return (
            <motion.button
              key={banner.url}
              type="button"
              title={banner.name}
              aria-label={`Use preset banner: ${banner.name}`}
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => onSelect(banner.url)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative w-12 aspect-video shrink-0 rounded-md overflow-hidden border-2 transition-colors cursor-pointer disabled:cursor-not-allowed",
                isSelected ? "border-brand-orange" : "border-transparent hover:border-dash"
              )}
            >
              <Image src={banner.url} alt="" fill unoptimized sizes="48px" className="object-cover" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetBannerStrip;
