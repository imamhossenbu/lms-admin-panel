"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonFormValues, LessonVideoSource } from "@/validations/lessonFormSchema";
import { ContentSectionHeader } from "./ContentSectionHeader";
import { VideoEmbedInput } from "./VideoEmbedInput";
import { VideoSourceTabs } from "./VideoSourceTabs";
import { VideoUploadPanel } from "./VideoUploadPanel";
import { useLessonVideoUpload } from "./useLessonVideoUpload";

interface LessonVideoSectionProps {
  optional?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

/** "Video Content" section: source tabs + upload panel or embed URL field. */
export function LessonVideoSection({ optional, onUploadingChange }: LessonVideoSectionProps) {
  const { control, setValue, clearErrors } = useFormContext<LessonFormValues>();
  const source = useWatch({ control, name: "video.source" });
  const uploader = useLessonVideoUpload(onUploadingChange);

  const changeSource = (next: LessonVideoSource) => {
    uploader.reset();
    setValue("video", { source: next, url: "", fileName: "", fileSize: 0, durationSeconds: 0 }, { shouldDirty: true });
    clearErrors("video");
  };

  return (
    <section>
      <ContentSectionHeader
        title="Video Content"
        description="Upload a video or embed from YouTube, Vimeo, or other platforms."
        optional={optional}
      />
      <div className="space-y-3">
        <VideoSourceTabs value={source} onChange={changeSource} disabled={uploader.isUploading} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={source}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {source === "UPLOAD" ? <VideoUploadPanel uploader={uploader} /> : <VideoEmbedInput source={source} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default LessonVideoSection;
