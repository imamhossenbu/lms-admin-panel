/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";

export interface MediaThumbnailProps {
  /** Hosted image URL (or a local preview URL); "" → gradient placeholder with the title. */
  src: string;
  /** Text shown on the placeholder and used as alt text. */
  title: string;
  /** Small caption on the placeholder's top-right ("HTML"). */
  caption?: string;
  /** Placeholder text size. */
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const TITLE_SIZE = { sm: "body-sm-medium", md: "title-medium", lg: "heading-h4" } as const;

/**
 * 16:9 media tile: shows the image, or a dark navy gradient with the title (first word white,
 * rest orange) when no image exists. Used for the course card, lesson/video thumbnails and previews.
 */
export function MediaThumbnail({ src, title, caption, size = "md", className, children }: MediaThumbnailProps) {
  const [first, ...rest] = (title.trim() || "Untitled").split(/\s+/);
  // Mock-hosted URLs don't resolve to real images, so fall back to the placeholder on error.
  const [failedSrc, setFailedSrc] = useState("");
  const showImage = !!src && failedSrc !== src;
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl bg-brand-navy", className)}>
      {showImage ? (
        <img src={src} alt={title} className="h-full w-full object-cover" onError={() => setFailedSrc(src)} />
      ) : (
        <div className="flex h-full w-full flex-col justify-center bg-linear-to-br from-brand-navy via-brand-card to-blue px-5" aria-label={title} role="img">
          {caption && <span className="absolute right-4 top-3 body-xsm-medium font-semibold! text-white">{caption}</span>}
          <span className={cn("block truncate font-bold! text-white", TITLE_SIZE[size])}>{first}</span>
          {rest.length > 0 && <span className={cn("block truncate font-bold! text-brand-orange", TITLE_SIZE[size])}>{rest.join(" ")}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export default MediaThumbnail;
