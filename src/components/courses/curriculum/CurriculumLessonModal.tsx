"use client";

import React, { useState, useEffect, useRef } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { coursesApi } from "@/lib/api";
import { toast } from "sonner";
import {
  PlayCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Paperclip,
} from "lucide-react";
import { LessonItem } from "./types";

interface CurriculumLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string | null;
  moduleTitle?: string;
  initialLesson?: LessonItem | null;
  onSave: (moduleId: string, lessonData: Partial<LessonItem>) => Promise<void>;
}

export function CurriculumLessonModal({
  isOpen,
  onClose,
  moduleId,
  moduleTitle,
  initialLesson,
  onSave,
}: CurriculumLessonModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("VIDEO");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [isPreview, setIsPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [resources, setResources] = useState("");

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialLesson) {
      setTitle(initialLesson.title);
      setType(initialLesson.type || "VIDEO");
      setDurationMinutes(initialLesson.durationMinutes || 15);
      setIsPreview(Boolean(initialLesson.isPreview));
      setVideoUrl(initialLesson.videoUrl || "");
      setContent(initialLesson.content || "");
      setResources(initialLesson.resources || "");
    } else {
      setTitle("");
      setType("VIDEO");
      setDurationMinutes(15);
      setIsPreview(false);
      setVideoUrl("");
      setContent("");
      setResources("");
    }
  }, [initialLesson, isOpen]);

  if (!isOpen || !moduleId) return null;

  const handleDeviceVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    const toastId = toast.loading("Uploading video to Cloudinary Cloud CDN...", {
      description: `Processing ${file.name}`,
    });

    try {
      const res = await coursesApi.uploadMedia(file);
      if (res && res.url) {
        setVideoUrl(res.url);
        toast.success("Video Uploaded Successfully!", {
          id: toastId,
          description: "Video stream hosted on Cloudinary CDN.",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      }
    } catch (err) {
      console.warn("Video upload fallback to local URL:", err);
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      toast.info("Using local video preview", { id: toastId });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(moduleId, {
        ...(initialLesson ? { id: initialLesson.id } : {}),
        title: title.trim(),
        type,
        durationMinutes: Number(durationMinutes) || 15,
        isPreview,
        videoUrl: videoUrl.trim() || undefined,
        content: content.trim() || undefined,
        resources: resources.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { label: "Video Lecture (Stream / Upload)", value: "VIDEO" },
    { label: "Article / Reading Material", value: "TEXT" },
    { label: "Diagnostic Quiz / Assessment", value: "QUIZ" },
  ];

  // Helper to extract embedded video URL
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  };

  const isEditing = Boolean(initialLesson);
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const embedUrl = getEmbedVideoUrl(videoUrl);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Lesson & Content" : "Add Lesson & Content"}
      subtitle={moduleTitle ? `Target Module: ${moduleTitle}` : undefined}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-primary-400 body-xsm-regular">
            <span>Type: {type}</span>
            <span>•</span>
            <span>Duration: {durationMinutes} mins</span>
          </div>

          <div className="flex items-center gap-2">
            <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Lesson Content"
                : "Save Lesson to Module"}
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* ================= 1. BASIC META ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <InputField
              label="Lesson Title"
              required
              placeholder="e.g. 01. Enterprise Architecture Patterns"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="sm:col-span-4">
            <DropdownSelect
              fieldLabel="Format / Type"
              options={typeOptions}
              value={type}
              onChange={(val) => setType(val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Duration (Minutes)"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            placeholder="15"
          />

          <div>
            <span className="block body-sm-regular text-primary-400 mb-2 select-none">
              Access Permissions
            </span>
            <label
              htmlFor="lessonIsPreview"
              className="flex h-[40px] items-center gap-2.5 px-3.5 rounded-[8px] border border-[#EDEDED] bg-white cursor-pointer hover:bg-slate-50 transition-colors select-none"
              style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}
            >
              <input
                type="checkbox"
                id="lessonIsPreview"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer"
              />
              <span className="body-sm-regular text-primary-500">
                Allow Free Preview (Open to all learners)
              </span>
            </label>
          </div>
        </div>

        {/* ================= 2. VIDEO STREAM SECTION (FOR VIDEO LESSONS) ================= */}
        {type === "VIDEO" && (
          <div className="p-4 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
            <div className="flex items-center justify-between">
              <span className="body-sm-medium text-[#1C4D8D] font-bold flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4" />
                <span>Video Source & Media Stream</span>
              </span>
              <span className="body-xsm-regular subtext-500">
                YouTube, Vimeo, Cloudinary, or direct MP4 URL
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste video stream link (e.g. https://www.youtube.com/watch?v=... or https://res.cloudinary.com/...)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 h-10 px-3 rounded-[8px] border border-[#EDEDED] bg-white body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-[#1C4D8D]"
              />

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4, video/webm, video/quicktime"
                onChange={handleDeviceVideoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploadingVideo}
                className="h-10 px-3.5 rounded-[8px] bg-white border border-[#EDEDED] hover:border-[#1C4D8D] text-[#1C4D8D] body-xsm-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {isUploadingVideo ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Upload Video</span>
              </button>
            </div>

            {/* Video Preview Player */}
            {videoUrl && (
              <div className="mt-2 rounded-[8px] overflow-hidden border border-[#EDEDED] bg-black aspect-video relative">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Video Preview"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= 3. LESSON CONTENT & LECTURE NOTES (TIPTAP NPM RICH TEXT ENGINE) ================= */}
        <RichTextEditor
          label={
            type === "VIDEO"
              ? "Lecture Summary & Supplementary Notes (TipTap Editor)"
              : type === "QUIZ"
              ? "Quiz Description & Question Outline (TipTap Editor)"
              : "Lesson Body & Detailed Reading Content (TipTap Editor)"
          }
          value={content}
          onChange={setContent}
          placeholder={
            type === "TEXT"
              ? "Write comprehensive lesson instructions, lecture notes, architecture guidelines, or code blocks..."
              : "Key takeaways, lecture timestamps, exercise instructions, or reading resources..."
          }
          minHeight="180px"
        />

        {/* ================= 4. DOWNLOADABLE ATTACHMENTS & RESOURCES ================= */}
        <InputField
          label="Downloadable Attachments / GitHub Repo (Optional)"
          leftElement={<Paperclip className="w-4 h-4" />}
          placeholder="e.g. https://github.com/org/repo or https://res.cloudinary.com/.../slides.pdf"
          value={resources}
          onChange={(e) => setResources(e.target.value)}
        />
      </form>
    </ModalShell>
  );
}

export default CurriculumLessonModal;
