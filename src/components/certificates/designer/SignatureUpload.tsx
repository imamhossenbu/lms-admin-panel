"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { FileImage, Loader2, PenLine, Upload, X } from "lucide-react";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import { cn } from "@/lib/cn";
import { SIGNATURE_MAX_BYTES, SIGNATURE_TYPES } from "./designerUtils";

export interface SignatureUploadProps {
  id: string;
  /** Hosted signature URL ("" = typed signature). Never a blob: URL. */
  value: string;
  onChange: (url: string) => void;
  /** Session-only local preview (blob:) shown while the hosted mock URL can't be displayed. */
  preview?: string;
  onPreviewChange: (url: string | null) => void;
  onUploadingChange: (uploading: boolean) => void;
}

/** Optional signature image: PNG/JPG ≤ 1 MB → mockUploadFile → hosted URL, with preview + remove. */
export function SignatureUpload({ id, value, onChange, preview, onPreviewChange, onUploadingChange }: SignatureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const handleFile = async (file: File) => {
    if (!SIGNATURE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type", { description: "Please choose a PNG or JPG image." });
      return;
    }
    if (file.size > SIGNATURE_MAX_BYTES) {
      toast.error("File is too large", { description: "Signature images can be at most 1 MB." });
      return;
    }
    const local = URL.createObjectURL(file);
    onPreviewChange(local);
    setBroken(false);
    setUploading(true);
    onUploadingChange(true);
    const toastId = toast.loading("Uploading signature...", { description: file.name });
    try {
      const { url } = await mockUploadFile(file);
      if (!url) throw new Error("Missing URL");
      // The signer may have been removed while uploading.
      if (alive.current) onChange(url);
      toast.success("Signature uploaded", { id: toastId, description: "It will appear above the signer's name." });
    } catch {
      onPreviewChange(null);
      toast.error("Signature upload failed", { id: toastId, description: "We couldn't upload this file. Please try again." });
    } finally {
      if (alive.current) setUploading(false);
      onUploadingChange(false);
    }
  };

  const remove = () => {
    onChange("");
    onPreviewChange(null);
    setBroken(false);
  };

  const src = preview ?? value;

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {src ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="flex h-14 items-center gap-3 rounded-lg border border-dash bg-white px-3"
          >
            <div className="relative h-10 w-28 shrink-0 overflow-hidden rounded-md bg-gray-bg">
              {broken ? (
                <span className="flex h-full w-full items-center justify-center text-primary-300">
                  <FileImage className="h-5 w-5" />
                </span>
              ) : (
                <Image src={src} alt="Signature preview" fill unoptimized sizes="112px" className="object-contain" onError={() => setBroken(true)} />
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-brand-orange">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="body-xsm-medium font-semibold! text-primary-500">{uploading ? "Uploading…" : "Signature image"}</p>
              <p className="body-2xsm-regular text-primary-300">PNG or JPG, max 1 MB</p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="body-xsm-medium text-brand-orange hover:text-brand-orange-hover disabled:opacity-50"
            >
              Replace
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={remove}
              disabled={uploading}
              aria-label="Remove signature image"
              className="flex h-7 w-7 items-center justify-center rounded-md text-primary-300 hover:bg-red-14 hover:text-red disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex h-14 w-full items-center gap-3 rounded-lg border border-dashed border-dash bg-white px-3 text-left transition-colors",
              "hover:border-brand-orange hover:bg-brand-orange-light"
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange">
              <Upload className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block body-xsm-medium font-semibold! text-primary-500">Upload signature (optional)</span>
              <span className="flex items-center gap-1 body-2xsm-regular text-primary-300">
                <PenLine className="h-3 w-3 shrink-0" /> PNG or JPG, max 1 MB · otherwise a typed signature is used
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SignatureUpload;
