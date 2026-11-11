"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link2, Upload } from "lucide-react";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/apiError";
import { InputField } from "@/components/ui/InputField";

const MAX_MB = 200;

/** Video link input with an "Upload" button (POST /courses/upload-media → hosted URL fills the field). */
export function VideoUrlField({ value, onChange, error }: { value: string; onChange: (url: string) => void; error?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (!file.type.startsWith("video/")) return void toast.error("Choose a video file", { description: "MP4, WebM or MOV." });
    if (file.size > MAX_MB * 1024 * 1024) return void toast.error("That video is too large", { description: `Keep uploads under ${MAX_MB} MB, or paste a YouTube / Vimeo link.` });
    setUploading(true);
    const id = toast.loading("Uploading the video…", { description: file.name });
    try {
      const { url } = await coursesApi.uploadMedia(file);
      onChange(url);
      toast.success("Video uploaded", { id, description: "Save the lesson to keep it." });
    } catch (e) {
      toast.error("Couldn't upload the video", { id, description: apiErrorMessage(e) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <InputField
        id="lesson-video"
        type="url"
        label="Video link"
        placeholder="https://www.youtube.com/watch?v=…"
        leftElement={<Link2 className="h-4 w-4" />}
        className="pr-28!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        rightElement={
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            disabled={uploading}
            onClick={() => input.current?.click()}
            className="-mr-1.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-dash bg-slate-50 px-2.5 body-xsm-medium text-primary-500 hover:border-primary-300 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload"}
          </motion.button>
        }
      />
      <input ref={input} type="file" accept="video/*" hidden onChange={(e) => (e.target.files?.[0] && upload(e.target.files[0]), (e.target.value = ""))} />
    </div>
  );
}

export default VideoUrlField;
