"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export interface PreviewThumbnailHeroProps {
  thumbnail?: string;
  title: string;
}

/** 16:9 course thumbnail with a centered play button; branded gradient when no image. */
export function PreviewThumbnailHero({ thumbnail, title }: PreviewThumbnailHeroProps) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-dash bg-brand-navy">
      {thumbnail ? (
        <Image src={thumbnail} alt={title || "Course thumbnail"} fill unoptimized sizes="520px" className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center bg-gradient-to-br from-brand-navy via-brand-card to-blue p-6">
          <span className="heading-h4 text-white line-clamp-2 w-3/5">{title || "Untitled course"}</span>
        </div>
      )}
      <motion.span
        aria-hidden
        whileHover={{ scale: 1.08 }}
        className="absolute inset-0 m-auto flex w-14 h-14 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm"
      >
        <Play className="w-6 h-6 ml-0.5 fill-current" />
      </motion.span>
    </div>
  );
}

export default PreviewThumbnailHero;
