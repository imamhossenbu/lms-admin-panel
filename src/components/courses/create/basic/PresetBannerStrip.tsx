"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRESET_BANNERS } from "@/components/courses/constants";

interface PresetBannerStripProps {
  value: string;
  disabled?: boolean;
  onSelect: (url: string) => void;
}

/** Grid of ready-made banners, a quick alternative to uploading a thumbnail. */
export function PresetBannerStrip({ value, disabled, onSelect }: PresetBannerStripProps) {
  return (
    <div className="mt-4 space-y-2">
      <p className="body-xsm-medium text-primary-400">Or choose a preset banner</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-0.5">
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
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative w-full aspect-video rounded-lg overflow-hidden ring-2 ring-offset-2 transition-shadow cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                isSelected ? "ring-brand-orange" : "ring-transparent hover:ring-dash"
              )}
            >
              <Image src={banner.url} alt="" fill unoptimized sizes="120px" className="object-cover" />
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs"
                >
                  <Check className="w-3 h-3" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetBannerStrip;
