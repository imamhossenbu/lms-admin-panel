"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mockUploadFile } from "@/lib/lessonEditorStorage";

export interface UploadRules {
  /** Allowed lower-case extensions without the dot, e.g. ["jpg", "png"]. */
  extensions: string[];
  maxBytes: number;
  /** Human label for messages, e.g. "thumbnail". */
  label: string;
}

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
};

export const fileExtension = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

/** Returns an error message, or null when the file passes the rules. */
export function validateUpload(file: File, rules: UploadRules): string | null {
  if (!rules.extensions.includes(fileExtension(file.name))) {
    return `Unsupported file type. Use ${rules.extensions.map((e) => e.toUpperCase()).join(", ")}.`;
  }
  if (file.size > rules.maxBytes) return `File is too large. Maximum size is ${formatBytes(rules.maxBytes)}.`;
  return null;
}

/**
 * Validates + uploads a file through mockUploadFile with the standard toast lifecycle and
 * reports in-flight state to the page (so "Update Lesson" waits for uploads).
 */
export function useMockUpload(rules: UploadRules, onUploadingChange?: (uploading: boolean) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const reportRef = useRef(onUploadingChange);
  useEffect(() => {
    reportRef.current = onUploadingChange;
  });
  // Clear the page-level flag if the component unmounts mid-upload.
  useEffect(() => () => reportRef.current?.(false), []);

  const { extensions, maxBytes, label } = rules;

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      const error = validateUpload(file, { extensions, maxBytes, label });
      if (error) {
        toast.error(`Invalid ${label}`, { description: error });
        return null;
      }
      const toastId = toast.loading(`Uploading ${label}...`, { description: file.name });
      setIsUploading(true);
      reportRef.current?.(true);
      try {
        const { url } = await mockUploadFile(file);
        toast.success(`${label.charAt(0).toUpperCase()}${label.slice(1)} uploaded`, { id: toastId, description: file.name });
        return url;
      } catch {
        toast.error("Upload failed", { id: toastId, description: "We couldn't upload the file. Please try again." });
        return null;
      } finally {
        setIsUploading(false);
        reportRef.current?.(false);
      }
    },
    [extensions, maxBytes, label]
  );

  return { upload, isUploading };
}
