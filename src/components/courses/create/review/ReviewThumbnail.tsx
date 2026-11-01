import React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** Small 16:9 thumbnail for the Basic Information review list. */
export function ReviewThumbnail({ src }: { src?: string }) {
  if (!src) {
    return (
      <ToneBadge tone="warning" size="sm" icon={<ImageIcon className="w-3 h-3" />}>
        No thumbnail
      </ToneBadge>
    );
  }
  return (
    <span className="relative block w-40 aspect-video overflow-hidden rounded-lg border border-dash bg-slate-100">
      <Image src={src} alt="Course thumbnail" fill unoptimized sizes="160px" className="object-cover" />
    </span>
  );
}

export default ReviewThumbnail;
