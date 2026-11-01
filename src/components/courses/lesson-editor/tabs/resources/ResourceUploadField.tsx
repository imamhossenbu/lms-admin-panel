"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import { cn } from "@/lib/cn";
import {
  RESOURCE_ACCEPT,
  fileExtension,
  formatBytes,
  resourceFileError,
} from "@/components/courses/create/lesson/resources/resourceUtils";
import { ResourceIcon } from "./ResourceIcon";

export interface UploadedResourceFile {
  url: string;
  fileName: string;
  size: number;
  format: string;
}

export interface ResourceUploadFieldProps {
  /** Current uploaded file (url "" = none). */
  value: UploadedResourceFile;
  error?: string;
  onUploaded: (file: UploadedResourceFile) => void;
  onClear: () => void;
  onUploadingChange: (uploading: boolean) => void;
}

/** Dashed "Click to upload or drag and drop" box → mockUploadFile with a progress bar and toasts. */
export function ResourceUploadField({ value, error, onUploaded, onClear, onUploadingChange }: ResourceUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pendingName, setPendingName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const mounted = useRef(true);
  const uploadingRef = useRef(false);
  const reportRef = useRef(onUploadingChange);
  useEffect(() => {
    reportRef.current = onUploadingChange;
  }, [onUploadingChange]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (uploadingRef.current) reportRef.current(false);
    };
  }, []);

  const upload = async (file: File) => {
    if (uploadingRef.current) return;
    const problem = resourceFileError(file);
    if (problem) {
      toast.error("Can't upload this file", { description: problem });
      return;
    }
    uploadingRef.current = true;
    onUploadingChange(true);
    setPendingName(file.name);
    setProgress(5);
    const timer = setInterval(() => setProgress((p) => (p === null ? p : Math.min(90, p + 7 + Math.round(Math.random() * 8)))), 120);
    const toastId = toast.loading("Uploading file...", { description: file.name });
    try {
      const { url } = await mockUploadFile(file);
      if (!mounted.current) return;
      setProgress(100);
      onUploaded({ url, fileName: file.name, size: file.size, format: fileExtension(file.name) });
      toast.success("File uploaded", { id: toastId, description: `${file.name} (${formatBytes(file.size)}) is ready.` });
    } catch {
      toast.error("Upload failed", { id: toastId, description: "We couldn't upload this file. Please try again." });
    } finally {
      clearInterval(timer);
      uploadingRef.current = false;
      if (mounted.current) {
        setProgress(null);
        setPendingName("");
        onUploadingChange(false);
      } else {
        reportRef.current(false);
      }
    }
  };

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploading = progress !== null;

  return (
    <div>
      <input ref={inputRef} type="file" accept={RESOURCE_ACCEPT} className="hidden" onChange={(e) => pick(e.target.files)} />
      <AnimatePresence mode="wait" initial={false}>
        {value.url && !uploading ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-3 rounded-xl border border-dash bg-white p-3"
          >
            <ResourceIcon resource={{ kind: "FILE", format: value.format }} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate body-sm-medium text-primary-500">{value.fileName}</p>
              <p className="body-xsm-regular text-primary-300">
                {value.format} • {formatBytes(value.size)}
              </p>
            </div>
            <button type="button" onClick={() => inputRef.current?.click()} className="body-xsm-medium text-blue hover:underline">
              Replace
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              aria-label="Remove file"
              onClick={onClear}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-300 hover:bg-red-14 hover:text-red"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="drop"
            type="button"
            disabled={uploading}
            whileTap={uploading ? undefined : { scale: 0.99 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!uploading) pick(e.dataTransfer.files);
            }}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors disabled:cursor-progress",
              error ? "border-red bg-red-14" : dragOver ? "border-blue bg-blue-14" : "border-dash bg-gray-bg hover:border-blue"
            )}
          >
            {uploading ? (
              <div className="w-full max-w-xs space-y-2">
                <p className="truncate body-sm-medium text-primary-500">Uploading {pendingName}...</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div className="h-full rounded-full bg-blue" animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
                </div>
                <p className="body-xsm-regular text-primary-300 tabular-nums">{progress}%</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-400 shadow-2xs">
                  <UploadCloud className="h-5 w-5" />
                </span>
                <span>
                  <span className="block body-sm-medium text-primary-500">Click to upload or drag and drop</span>
                  <span className="block body-xsm-regular text-primary-300">PDF, DOC, PPT, ZIP (Max 50 MB)</span>
                </span>
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default ResourceUploadField;
