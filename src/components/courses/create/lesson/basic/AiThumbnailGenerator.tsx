"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { InputField } from "@/components/ui/InputField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { LessonFormValues } from "@/validations/lessonFormSchema";

/** "AI Generate Thumbnail" (Beta): the prompt is kept in the form; generation itself is not available yet. */
export function AiThumbnailGenerator() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LessonFormValues>();

  return (
    <div className="space-y-3 sm:pt-7">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple" />
        <span className="body-sm-medium text-primary-500">AI Generate Thumbnail</span>
        <ToneBadge tone="purple" size="sm">
          Beta
        </ToneBadge>
      </div>
      <InputField
        id="lesson-thumbnail-prompt"
        aria-label="Thumbnail prompt"
        placeholder="e.g. HTML tutorial thumbnail, modern and clean design"
        maxLength={200}
        error={errors.thumbnailPrompt?.message}
        {...register("thumbnailPrompt")}
      />
      <div className="flex justify-end">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            toast.info("AI thumbnail generation is coming soon", {
              description: "Your prompt is saved with the lesson. Upload a thumbnail for now.",
            })
          }
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-purple/30 bg-purple-14 px-4 body-sm-medium text-purple transition-colors hover:bg-purple hover:text-white"
        >
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </motion.button>
      </div>
    </div>
  );
}

export default AiThumbnailGenerator;
