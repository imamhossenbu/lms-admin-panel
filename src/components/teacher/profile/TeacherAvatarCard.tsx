"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Camera, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { apiErrorMessage } from "@/lib/apiError";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { Avatar } from "@/components/ui/Avatar";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";

const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Teacher profile photo (shown on the academy website's course and Instructors pages). */
export function TeacherAvatarCard({ name, avatar }: { name: string; avatar: string | null }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const input = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(avatar);
  const [busy, setBusy] = useState(false);

  const apply = (next: string | null) => {
    setSrc(next);
    if (user) dispatch(setUser({ ...user, avatar: next }));
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (!TYPES.includes(file.type)) return toast.error("Unsupported image", { description: "Use a JPG, PNG or WebP image." });
    if (file.size > 3 * 1024 * 1024) return toast.error("Image too large", { description: "Choose an image of 3 MB or less." });
    setBusy(true);
    const id = toast.loading("Uploading your photo…");
    try {
      const body = new FormData();
      body.append("avatar", file);
      const { data } = await apiClient.post<{ avatar: string }>("/user/avatar", body);
      apply(data.avatar);
      toast.success("Photo updated", { id, description: "Learners see it on your courses." });
    } catch (e) {
      toast.error("Couldn't upload your photo", { id, description: apiErrorMessage(e) });
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    const id = toast.loading("Removing your photo…");
    try {
      await apiClient.delete("/user/avatar");
      apply(null);
      toast.success("Photo removed", { id });
    } catch (e) {
      toast.error("Couldn't remove your photo", { id, description: apiErrorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsCard icon={<ImageIcon className="h-5 w-5" />} title="Profile photo" description="JPG, PNG or WebP, up to 3 MB." tone="green">
      <div className="flex flex-wrap items-center gap-5 p-5">
        <div className="relative">
          <Avatar name={name} src={src} size={72} />
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button type="button" whileTap={{ scale: 0.96 }} disabled={busy} onClick={() => input.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-orange px-4 body-sm-medium text-white hover:bg-brand-orange-hover disabled:opacity-60">
            <Camera className="h-4 w-4" />
            {src ? "Change photo" : "Upload photo"}
          </motion.button>
          {src && (
            <motion.button type="button" whileTap={{ scale: 0.96 }} disabled={busy} onClick={remove} className="inline-flex h-10 items-center gap-2 rounded-lg border border-dash bg-white px-4 body-sm-medium text-red hover:border-red">
              <Trash2 className="h-4 w-4" />
              Remove
            </motion.button>
          )}
        </div>
        <input ref={input} type="file" accept={TYPES.join(",")} className="sr-only" aria-label="Upload profile photo" onChange={(e) => void upload(e.target.files?.[0])} />
      </div>
    </SettingsCard>
  );
}

export default TeacherAvatarCard;
