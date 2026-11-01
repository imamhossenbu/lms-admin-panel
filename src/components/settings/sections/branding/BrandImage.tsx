"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface BrandImageProps {
  /** Local blob preview or hosted URL. */
  src: string;
  alt: string;
  className?: string;
  /** "contain" for logos, "cover" for backgrounds. */
  fit?: "contain" | "cover";
  /** Rendered when the image can't be displayed (mock URLs). */
  fallback: React.ReactNode;
  /** Drawn over the image only while it displays (e.g. a darkening scrim). */
  overlay?: React.ReactNode;
}

function BrandImageInner({ src, alt, className, fit = "contain", fallback, overlay }: BrandImageProps) {
  const [broken, setBroken] = useState(false);
  if (broken) return <>{fallback}</>;
  return (
    <span className={cn("relative block", className)}>
      <Image src={src} alt={alt} fill unoptimized sizes="400px" className={fit === "cover" ? "object-cover" : "object-contain"} onError={() => setBroken(true)} />
      {overlay}
    </span>
  );
}

/** Image for the live previews that falls back gracefully (resets when the source changes). */
export function BrandImage(props: BrandImageProps) {
  if (!props.src) return <>{props.fallback}</>;
  return <BrandImageInner key={props.src} {...props} />;
}

export default BrandImage;
