"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Pause, Play, Video, X } from "lucide-react";

interface MediaPreviewTileProps {
  kind: "image" | "video";
  src: string;
  isUploading?: boolean;
  onRemove: () => void;
}

/** 16:9 preview of the chosen image / video with a remove button and upload overlay. */
export function MediaPreviewTile({ kind, src, isUploading, onRemove }: MediaPreviewTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.2 }}
      className="relative w-full aspect-video rounded-xl overflow-hidden border border-dash bg-slate-100"
    >
      {kind === "image" ? (
        <Image src={src} alt="Course thumbnail" fill unoptimized sizes="320px" className="object-cover" />
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause promo video" : "Play promo video"}
              className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </button>
          )}
        </>
      )}

      {isUploading ? (
        <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
          <span className="body-xsm-medium text-primary-500">Uploading...</span>
          <div className="w-2/3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full w-1/3 rounded-full bg-brand-orange"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onRemove}
          aria-label={kind === "image" ? "Remove thumbnail" : "Remove promo video"}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-primary-500 shadow-xs flex items-center justify-center hover:bg-red-14 hover:text-red transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}

/** Placeholder shown in the preview slot before anything is chosen. */
export const MediaEmptyTile = React.forwardRef<HTMLDivElement, { kind: "image" | "video" }>(({ kind }, ref) => {
  const Icon = kind === "image" ? ImageIcon : Video;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full aspect-video rounded-xl border border-dash bg-gray-bg flex flex-col items-center justify-center gap-1.5 text-center px-3"
    >
      <Icon className="w-6 h-6 text-primary-300" />
      <span className="body-xsm-regular text-primary-300">
        {kind === "image" ? "No thumbnail selected" : "No promo video yet"}
      </span>
    </motion.div>
  );
});
MediaEmptyTile.displayName = "MediaEmptyTile";

export default MediaPreviewTile;
