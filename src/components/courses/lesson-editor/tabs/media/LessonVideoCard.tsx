"use client";

import React, { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { VideoSourceTabs } from "./VideoSourceTabs";
import { VideoDropzone } from "./VideoDropzone";
import { VideoUrlField } from "./VideoUrlField";
import { UploadedVideoRow } from "./UploadedVideoRow";
import { VideoOptimizationNote } from "./VideoOptimizationNote";
import { VideoLibraryModal } from "./VideoLibraryModal";
import { EMPTY_VIDEO, type LessonVideo, type VideoSource } from "./videoUtils";
import type { useVideoUpload } from "./useVideoUpload";

export interface LessonVideoCardProps {
  upload: ReturnType<typeof useVideoUpload>;
  onViewPreview: () => void;
}

/** "Lesson Video": source tabs, upload dropzone / URL input / library picker and the uploaded file row. */
export function LessonVideoCard({ upload, onViewPreview }: LessonVideoCardProps) {
  const { control, getValues, setValue } = useFormContext<LessonEditorValues>();
  const [video, posterUrl, title] = useWatch({ control, name: ["media.video", "media.posterUrl", "content.title"] });
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  // Remember what each source held so switching tabs back and forth doesn't lose input.
  const snapshots = useRef<Partial<Record<VideoSource, LessonVideo>>>({});

  const changeSource = (next: VideoSource) => {
    const current = getValues("media.video");
    if (next === current.source) return;
    snapshots.current[current.source] = current;
    setValue("media.video", snapshots.current[next] ?? { ...EMPTY_VIDEO, source: next }, { shouldDirty: true, shouldValidate: true });
    if (next === "LIBRARY" && !snapshots.current.LIBRARY?.url) setIsLibraryOpen(true);
  };

  const removeVideo = () => {
    snapshots.current[video.source] = undefined;
    upload.clearVideo(video.source);
    toast.success("Video removed", { description: "Click “Update Lesson” to save the change." });
  };

  const showFileRow = (video.source === "UPLOAD" || video.source === "LIBRARY") && (!!video.url || upload.isUploading);

  return (
    <IconSectionCard
      icon={<PlayCircle className="h-5 w-5" />}
      title="Lesson Video"
      description="Upload or add a video for this lesson. You can also embed from YouTube, Vimeo or other platforms."
      tone="blue"
      bodyClassName="space-y-4"
    >
      <VideoSourceTabs value={video.source} onChange={changeSource} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={video.source} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
          {video.source === "UPLOAD" && <VideoDropzone onFile={(file) => void upload.uploadFile(file)} disabled={upload.isUploading} />}
          {(video.source === "YOUTUBE" || video.source === "VIMEO" || video.source === "LINK") && <VideoUrlField source={video.source} />}
          {video.source === "LIBRARY" && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-blue/40 px-4 py-6 text-center">
              <FolderOpen className="h-8 w-8 text-blue" />
              <p className="body-sm-regular text-primary-300">Pick a video you have already uploaded to your media library.</p>
              <SecondaryButton leftIcon={<FolderOpen />} onClick={() => setIsLibraryOpen(true)}>
                {video.url ? "Choose Another Video" : "Browse Library"}
              </SecondaryButton>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showFileRow && (
        <div className="space-y-2.5">
          <p className="body-sm-medium text-primary-500">{video.source === "LIBRARY" ? "Selected Video" : "Uploaded Video"}</p>
          <UploadedVideoRow
            video={video}
            posterUrl={posterUrl}
            title={title || "Lesson Video"}
            isUploading={upload.isUploading}
            pendingName={upload.pendingName}
            progress={upload.isUploading ? upload.progress : 100}
            onView={onViewPreview}
            onDelete={removeVideo}
          />
        </div>
      )}

      <VideoOptimizationNote />

      <VideoLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        selectedUrl={video.source === "LIBRARY" ? video.url : ""}
        onSelect={(item) => {
          const { url, fileName, fileSize, width, height, durationSeconds, format } = item;
          setValue("media.video", { source: "LIBRARY", url, fileName, fileSize, width, height, durationSeconds, format }, { shouldDirty: true, shouldValidate: true });
          toast.success("Video selected", { description: item.title });
        }}
      />
    </IconSectionCard>
  );
}

export default LessonVideoCard;
