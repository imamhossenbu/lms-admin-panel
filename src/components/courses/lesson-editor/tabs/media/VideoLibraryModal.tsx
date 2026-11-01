"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MediaThumbnail } from "../../fields/MediaThumbnail";
import { formatBytes } from "../../hooks/useMockUpload";
import { formatDuration } from "./videoUtils";
import { MOCK_VIDEO_LIBRARY, type LibraryVideo } from "./videoLibrary";

export interface VideoLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: string;
  onSelect: (video: LibraryVideo) => void;
}

/** Small picker listing previously uploaded videos. */
export function VideoLibraryModal({ isOpen, onClose, selectedUrl, onSelect }: VideoLibraryModalProps) {
  const [query, setQuery] = useState("");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const currentId = pickedId ?? MOCK_VIDEO_LIBRARY.find((v) => v.url === selectedUrl)?.id ?? null;
  const items = MOCK_VIDEO_LIBRARY.filter((v) => v.title.toLowerCase().includes(query.trim().toLowerCase()));
  const picked = MOCK_VIDEO_LIBRARY.find((v) => v.id === currentId);

  const close = () => {
    setPickedId(null);
    setQuery("");
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Choose from Library"
      subtitle="Reuse a video you have already uploaded."
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={close}>Cancel</SecondaryButton>
          <PrimaryButton
            disabled={!picked}
            onClick={() => {
              if (!picked) return;
              onSelect(picked);
              close();
            }}
          >
            Use Video
          </PrimaryButton>
        </>
      }
    >
      <InputField
        placeholder="Search videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftElement={<Search className="h-4 w-4" />}
        aria-label="Search library videos"
      />
      <ul className="mt-4 space-y-2.5" role="listbox" aria-label="Library videos">
        <AnimatePresence initial={false}>
          {items.map((video) => {
            const isPicked = video.id === currentId;
            return (
              <motion.li key={video.id} layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={isPicked}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPickedId(video.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3.5 rounded-xl border p-2.5 text-left transition-colors",
                    isPicked ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white"
                  )}
                >
                  <MediaThumbnail src="" title={video.title} size="sm" className="w-28 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate body-sm-medium text-primary-500">{video.title}</p>
                    <p className="mt-0.5 truncate body-xsm-regular text-primary-300">
                      {video.fileName} • {video.width} × {video.height} • {formatBytes(video.fileSize)}
                    </p>
                    <p className="mt-0.5 body-xsm-regular text-primary-300">Uploaded {video.uploadedAt}</p>
                  </div>
                  <ToneBadge tone="gray" size="sm">{formatDuration(video.durationSeconds)}</ToneBadge>
                  <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", isPicked ? "bg-brand-orange text-white" : "border border-dash")}>
                    {isPicked && <Check className="h-3.5 w-3.5" />}
                  </span>
                </motion.button>
              </motion.li>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && <li className="py-8 text-center body-sm-regular text-primary-300">No videos match “{query}”.</li>}
      </ul>
    </ModalShell>
  );
}

export default VideoLibraryModal;
