"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Play, Star, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CoursePreviewData } from "./previewTypes";

interface PreviewHeroProps {
  data: CoursePreviewData;
  size: "compact" | "large";
}

/** Thumbnail (plays the promo video when present), title, meta line and rating row. */
export function PreviewHero({ data, size }: PreviewHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isLarge = size === "large";
  const meta = [data.categoryName, data.language, data.levelLabel].filter(Boolean).join(" · ");
  const canPlay = Boolean(data.promoVideo);

  return (
    <div className={cn("grid gap-4", isLarge ? "md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2")}>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-dash">
        {isPlaying && canPlay ? (
          <video src={data.promoVideo} controls autoPlay className="absolute inset-0 w-full h-full bg-black" />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {data.thumbnail ? (
                <motion.div
                  key={data.thumbnail}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image src={data.thumbnail} alt="" fill unoptimized sizes="480px" className="object-cover" />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-primary-300"
                >
                  <ImageIcon className="w-7 h-7" />
                  <span className="body-xsm-regular">Thumbnail preview</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              disabled={!canPlay}
              onClick={() => setIsPlaying(true)}
              aria-label={canPlay ? "Play promo video" : "No promo video uploaded"}
              whileHover={canPlay ? { scale: 1.08 } : undefined}
              className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/90 text-primary-500 shadow-md flex items-center justify-center cursor-pointer disabled:cursor-default"
            >
              <Play className="w-4.5 h-4.5 ml-0.5 fill-current" />
            </motion.button>
          </>
        )}
      </div>

      <div className="min-w-0 text-left">
        <motion.h3
          key={data.title || "untitled"}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className={cn("font-bold text-primary-500 break-words", isLarge ? "heading-h4" : "title-sm")}
        >
          {data.title || "Untitled course"}
        </motion.h3>
        <p className="body-sm-regular text-primary-300 mt-1.5">{meta || "Category · Language · Level"}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 body-xsm-regular text-primary-300">
          <span className="inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow fill-current" />
            <span className="body-xsm-medium text-primary-500">0.0</span>
            (No reviews yet)
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            New course
          </span>
        </div>
      </div>
    </div>
  );
}

export default PreviewHero;
