"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { DetailCard } from "@/components/ui/DetailCard";
import { TagsInput } from "@/components/ui/TagsInput";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { coursesApi } from "@/lib/api";
import type { CategoryOption } from "@/components/courses/constants";
import { COURSE_TAGS_MAX, type CourseBasicInfoInput } from "@/validations/courseSchema";
import type { AiOutline } from "./aiOutline";
import { MediaUploadField } from "./MediaUploadField";
import { THUMBNAIL_UPLOAD, VIDEO_UPLOAD } from "./createCourseOptions";
import { AiOutlineNotice } from "./basic/AiOutlineNotice";
import { CourseClassificationFields } from "./basic/CourseClassificationFields";
import { CourseTextFields } from "./basic/CourseTextFields";
import { FieldLabel } from "./basic/FieldLabel";
import { PresetBannerStrip } from "./basic/PresetBannerStrip";

interface BasicInformationCardProps {
  categories: CategoryOption[];
  acceptedOutline: AiOutline | null;
  onGenerateAi: () => void;
  onViewOutline: () => void;
  onRemoveOutline: () => void;
  onUploadingChange: (kind: "thumbnail" | "video", uploading: boolean) => void;
}

/** Step 1 form: course text, media, classification and tags. */
export function BasicInformationCard({
  categories,
  acceptedOutline,
  onGenerateAi,
  onViewOutline,
  onRemoveOutline,
  onUploadingChange,
}: BasicInformationCardProps) {
  const { control, formState } = useFormContext<CourseBasicInfoInput>();
  const { errors } = formState;

  return (
    <DetailCard
      title="Basic Information"
      description="Add the main details about your course. This information will be visible to students."
      action={
        <motion.button
          type="button"
          onClick={onGenerateAi}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-purple/30 bg-purple-14 text-purple body-sm-medium font-semibold whitespace-nowrap hover:border-purple transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </motion.button>
      }
    >
      <AnimatePresence initial={false}>
        {acceptedOutline && (
          <AiOutlineNotice
            key="ai-outline"
            outline={acceptedOutline}
            onView={onViewOutline}
            onRemove={onRemoveOutline}
          />
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <CourseTextFields />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <FieldLabel label="Course Thumbnail" required />
            <Controller
              control={control}
              name="thumbnail"
              render={({ field }) => (
                <MediaUploadField
                  kind="image"
                  value={field.value}
                  onChange={field.onChange}
                  config={THUMBNAIL_UPLOAD}
                  upload={coursesApi.uploadThumbnail}
                  error={errors.thumbnail?.message}
                  onUploadingChange={(uploading) => onUploadingChange("thumbnail", uploading)}
                  footer={<PresetBannerStrip value={field.value} onSelect={field.onChange} />}
                />
              )}
            />
          </div>

          <div>
            <FieldLabel label="Promo Video" optional />
            <Controller
              control={control}
              name="promoVideo"
              render={({ field }) => (
                <MediaUploadField
                  kind="video"
                  value={field.value}
                  onChange={field.onChange}
                  config={VIDEO_UPLOAD}
                  upload={coursesApi.uploadMedia}
                  onUploadingChange={(uploading) => onUploadingChange("video", uploading)}
                />
              )}
            />
          </div>
        </div>

        <CourseClassificationFields categories={categories} />

        <div>
          <FieldLabel htmlFor="course-tags" label="Tags" />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput
                id="course-tags"
                value={field.value}
                onChange={field.onChange}
                maxTags={COURSE_TAGS_MAX}
                placeholder="Type a tag and press enter..."
                error={errors.tags?.message}
                renderTag={(tag) => (
                  <ToneBadge tone="navy" size="md">
                    {tag}
                  </ToneBadge>
                )}
              />
            )}
          />
        </div>
      </div>
    </DetailCard>
  );
}

export default BasicInformationCard;
