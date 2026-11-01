"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import type { LiveResourceType } from "@/types/liveClass";
import { cn } from "@/lib/cn";
import { errorText, formatBytes } from "../qa/liveTabFormat";
import { RESOURCE_TYPE_META } from "./resourceMeta";
import { ResourceTypeTile } from "./ResourceTypeTile";

export interface ResourceFileFieldProps {
  type: LiveResourceType;
  url: string;
  size: number;
  onUploaded: (file: { url: string; size: number; name: string }) => void;
  onClear: () => void;
  onUploadingChange: (uploading: boolean) => void;
  error?: string;
}

const fileNameOf = (url: string) => decodeURIComponent(url.split("/").pop() ?? "").replace(/^[a-z0-9]+-(?=.)/, "") || url;

/** File picker with a simulated upload progress bar (mockUploadFile → https URL + size, never blob: URLs). */
export function ResourceFileField({ type, url, size, onUploaded, onClear, onUploadingChange, error }: ResourceFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState("");
  const meta = RESOURCE_TYPE_META[type];

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const pick = async (file: File) => {
    if (file.size > meta.maxBytes) {
      toast.error("File is too large", { description: `${file.name} is ${formatBytes(file.size)}. The limit for a ${meta.label.toLowerCase()} is ${formatBytes(meta.maxBytes)}.` });
      return;
    }
    setFileName(file.name);
    setProgress(4);
    onUploadingChange(true);
    timer.current = setInterval(() => setProgress((p) => (p === null ? p : Math.min(92, p + (92 - p) * 0.18))), 90);
    const toastId = toast.loading("Uploading file...", { description: file.name });
    try {
      const { url: uploaded } = await mockUploadFile(file);
      setProgress(100);
      onUploaded({ url: uploaded, size: file.size, name: file.name });
      toast.success("File uploaded", { id: toastId, description: `${file.name} (${formatBytes(file.size)}) is ready to share.` });
    } catch (e) {
      toast.error("Upload failed", { id: toastId, description: errorText(e, "We couldn't upload this file. Please try again.") });
    } finally {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      setTimeout(() => setProgress(null), 350);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const uploading = progress !== null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={meta.accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pick(file);
        }}
      />
      {uploading ? (
        <div className="rounded-xl border border-dash p-3.5">
          <div className="flex items-center justify-between gap-3 body-sm-medium">
            <span className="truncate text-primary-500">{fileName}</span>
            <span className="shrink-0 text-brand-orange">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-bg">
            <motion.div className="h-full rounded-full bg-brand-orange" animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
          </div>
        </div>
      ) : url ? (
        <div className="flex items-center gap-3 rounded-xl border border-dash p-3">
          <ResourceTypeTile type={type} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate body-sm-medium text-primary-500" title={url}>
              {fileName || fileNameOf(url)}
            </p>
            <p className="body-xsm-regular text-primary-300">{formatBytes(size)}</p>
          </div>
          <CardActionButton icon={<RefreshCw className="h-4 w-4" />} onClick={() => inputRef.current?.click()}>
            Replace
          </CardActionButton>
          <CardActionButton
            icon={<Trash2 className="h-4 w-4" />}
            aria-label="Remove file"
            onClick={() => {
              setFileName("");
              onClear();
            }}
          >
            Remove
          </CardActionButton>
        </div>
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors hover:border-brand-orange hover:bg-brand-orange-light",
            error ? "border-red bg-red-14" : "border-dash"
          )}
        >
          <UploadCloud className="h-7 w-7 text-brand-orange" />
          <span className="mt-2 body-sm-medium text-primary-500">Click to upload a {meta.label.toLowerCase()} file</span>
          <span className="mt-0.5 body-xsm-regular text-primary-300">
            {meta.accept === "video/*" ? "MP4, MOV, WEBM" : meta.accept.replace(/\./g, "").toUpperCase().split(",").slice(0, 6).join(", ")} · up to {formatBytes(meta.maxBytes)}
          </span>
        </motion.button>
      )}
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default ResourceFileField;
