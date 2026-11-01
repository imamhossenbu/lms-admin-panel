"use client";

import React from "react";
import { useWatch, type Control } from "react-hook-form";
import { Clock, Download, ExternalLink, FileText, Link2 } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { LESSON_TYPE_LABEL } from "@/components/courses/create/aiOutline";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { MediaThumbnail } from "./fields/MediaThumbnail";
import { VideoPlayerPreview } from "./tabs/media/VideoPlayerPreview";

export interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  control: Control<LessonEditorValues>;
  context: LessonEditorContext;
}

function PreviewBody({ control, context }: Pick<LessonPreviewModalProps, "control" | "context">) {
  const [content, media, resources] = useWatch({ control, name: ["content", "media", "resources"] });
  const moduleRef = context.modules.find((m) => m.id === content.moduleId);
  const hasVideo = media.player.enabled && !!media.video.url;

  return (
    <div className="space-y-5">
      {hasVideo ? (
        <VideoPlayerPreview
          url={media.video.url}
          posterUrl={media.posterUrl || content.thumbnailUrl}
          title={content.title}
          durationSeconds={media.video.durationSeconds}
          allowDownload={media.player.allowDownload}
          pictureInPicture={media.player.pictureInPicture}
        />
      ) : (
        <MediaThumbnail src={content.thumbnailUrl} title={content.title || "Untitled lesson"} size="lg" />
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {moduleRef && (
            <ToneBadge tone="blue" size="sm">
              Module {moduleRef.order}: {moduleRef.title}
            </ToneBadge>
          )}
          <ToneBadge tone="orange" size="sm">{LESSON_TYPE_LABEL[content.type]}</ToneBadge>
          <span className="inline-flex items-center gap-1 body-xsm-regular text-primary-300">
            <Clock className="h-3.5 w-3.5" />
            {content.durationMinutes || 0} min
          </span>
        </div>
        <h3 className="heading-h4 text-primary-500">{content.title || "Untitled lesson"}</h3>
        {content.shortDescription && <p className="body-regular text-primary-400">{content.shortDescription}</p>}
      </div>

      {content.body.replace(/<[^>]*>/g, "").trim() && (
        <div className="rounded-xl border border-dash p-4">
          <RichTextContent html={content.body} />
        </div>
      )}

      {resources.items.filter((r) => r.visible).length > 0 && (
        <div className="space-y-2.5">
          <p className="body-sm-medium font-semibold! text-primary-500">Lesson Resources</p>
          <ul className="divide-y divide-dash rounded-xl border border-dash">
            {resources.items
              .filter((r) => r.visible)
              .map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-3.5 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
                    {r.kind === "LINK" ? <Link2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate body-sm-medium text-primary-500">{r.title}</p>
                    {r.description && <p className="truncate body-xsm-regular text-primary-300">{r.description}</p>}
                  </div>
                  <ToneBadge tone="gray" size="sm">{r.format || (r.kind === "LINK" ? "LINK" : "FILE")}</ToneBadge>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.title}`} className="text-primary-300 transition-colors hover:text-brand-orange">
                      {r.kind === "LINK" ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    </a>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Student-facing preview of the lesson as currently edited (unsaved values included). */
export function LessonPreviewModal({ isOpen, onClose, control, context }: LessonPreviewModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Lesson Preview"
      subtitle="This is how students will see the lesson (including unsaved changes)."
      maxWidth="xl"
      footer={<SecondaryButton onClick={onClose}>Close Preview</SecondaryButton>}
    >
      {isOpen && <PreviewBody control={control} context={context} />}
    </ModalShell>
  );
}

export default LessonPreviewModal;
