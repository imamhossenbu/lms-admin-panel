"use client";

import React, { useState, useEffect, useRef } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { coursesApi } from "@/lib/api";
import { toast } from "sonner";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Eye,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Quote,
  Link as LinkIcon,
  Paperclip,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setActiveTab("edit");
  }, [initialLesson, isOpen]);

  if (!isOpen || !moduleId) return null;

  // Formatting helpers for rich markdown content
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

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

        {/* ================= 3. LESSON CONTENT & LECTURE NOTES (TEXT/MARKDOWN) ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="body-sm-medium text-primary-500 font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#1C4D8D]" />
              <span>
                {type === "VIDEO"
                  ? "Lecture Summary & Supplementary Notes (Markdown)"
                  : type === "QUIZ"
                  ? "Quiz Description & Question Outline"
                  : "Lesson Body & Detailed Reading Content (Markdown)"}
              </span>
            </label>

            {/* Edit / Preview Tabs */}
            <div className="flex items-center p-0.5 rounded-[6px] bg-[#F8F9FA] border border-[#EDEDED]">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-2.5 py-0.5 rounded-[4px] body-xsm-medium transition-all cursor-pointer ${
                  activeTab === "edit"
                    ? "bg-white text-[#1C4D8D] font-bold shadow-2xs"
                    : "text-primary-400 hover:text-primary-500"
                }`}
              >
                Author
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-2.5 py-0.5 rounded-[4px] body-xsm-medium transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white text-[#1C4D8D] font-bold shadow-2xs"
                    : "text-primary-400 hover:text-primary-500"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <div className="rounded-[8px] border border-[#EDEDED] bg-white overflow-hidden focus-within:border-[#1C4D8D]">
              {/* Markdown Toolbar */}
              <div className="p-1.5 bg-[#F8F9FA] border-b border-[#EDEDED] flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("### ")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Heading"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("- ")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("```typescript\n", "\n```")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Code Block"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("> ")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Quote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("[", "](https://...)")}
                  className="p-1.5 rounded hover:bg-gray-200 text-primary-500 cursor-pointer"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === "TEXT"
                    ? "# Lesson Overview\n\nExplain core concepts, architecture diagrams, and code snippets here...\n\n```ts\nexport function example() {}\n```"
                    : "Key takeaways, lecture timestamps, exercise instructions, or reading resources..."
                }
                className="w-full p-3 body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-y font-mono text-xs leading-relaxed"
              />

              <div className="p-1.5 bg-[#F8F9FA] border-t border-[#EDEDED] flex items-center justify-between text-[11px] text-primary-400">
                <span>Supports full Markdown, code formatting, and lists</span>
                <span>
                  {wordCount} words • {content.length} characters
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[8px] border border-[#EDEDED] bg-white min-h-[160px] max-h-[300px] overflow-y-auto body-sm-regular text-primary-500 space-y-2 whitespace-pre-wrap">
              {content ? (
                content
              ) : (
                <span className="text-primary-300 italic">
                  No lecture content typed yet. Switch to Author tab to write content.
                </span>
              )}
            </div>
          )}
        </div>

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
