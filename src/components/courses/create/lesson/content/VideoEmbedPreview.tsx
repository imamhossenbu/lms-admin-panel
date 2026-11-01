"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { LessonVideoSource } from "@/validations/lessonFormSchema";
import { getEmbedUrl, isDirectVideoUrl } from "./videoUtils";

interface VideoEmbedPreviewProps {
  url: string;
  source: LessonVideoSource;
}

/** Live player preview for a valid YouTube / Vimeo / direct video link; a link card otherwise. */
export function VideoEmbedPreview({ url, source }: VideoEmbedPreviewProps) {
  const embedUrl = getEmbedUrl(url, source);
  const direct = !embedUrl && source === "LINK" && isDirectVideoUrl(url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border border-dash bg-slate-50"
    >
      {embedUrl ? (
        <div className="aspect-video bg-brand-navy">
          <iframe
            src={embedUrl}
            title="Lesson video preview"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : direct ? (
        <video src={url} controls preload="metadata" className="w-full aspect-video bg-brand-navy" />
      ) : (
        <div className="flex items-center gap-3 p-3.5">
          <span className="w-9 h-9 shrink-0 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">
            <ExternalLink className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500">Preview not available</p>
            <p className="body-xsm-regular text-primary-300 truncate">
              Students will open this link from the lesson: {url}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default VideoEmbedPreview;
