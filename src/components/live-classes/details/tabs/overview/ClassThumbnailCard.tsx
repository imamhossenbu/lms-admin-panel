"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil } from "lucide-react";
import type { LiveClassItem, LiveCourseRef } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { courseOf } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";
import { LargeCourseTile } from "../../common/LargeCourseTile";

const BANNER: Record<LiveCourseRef["tone"], string> = {
  yellow: "bg-yellow-bg border-yellow/30",
  purple: "bg-purple-14 border-purple/30",
  blue: "bg-blue-14 border-blue/30",
  orange: "bg-brand-orange-light border-brand-orange/20",
  green: "bg-green-bg border-green/30",
  red: "bg-red-14 border-red/30",
};

/** Uploaded thumbnail, or a course-tone banner with the course tile + class title. */
export function ClassThumbnailCard({ liveClass }: { liveClass: LiveClassItem }) {
  const router = useRouter();
  const course = courseOf(liveClass.courseId);
  return (
    <IconSectionCard
      icon={<ImageIcon className="h-5 w-5" />}
      tone="yellow"
      title="Class Thumbnail"
      action={
        <CardActionButton icon={<Pencil />} onClick={() => router.push(`/live-classes/${liveClass.id}/edit`)}>
          Edit
        </CardActionButton>
      }
    >
      {liveClass.thumbnailUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dash bg-gray-bg">
          <Image src={liveClass.thumbnailUrl} alt={`${liveClass.title} thumbnail`} fill unoptimized sizes="400px" className="object-cover" />
        </div>
      ) : (
        <div className={cn("flex aspect-video w-full items-center gap-4 overflow-hidden rounded-xl border p-5", BANNER[course?.tone ?? "orange"])}>
          <LargeCourseTile courseId={liveClass.courseId} className="bg-white" />
          <p className="heading-h5 font-bold! text-primary-500 line-clamp-3">{liveClass.title}</p>
        </div>
      )}
    </IconSectionCard>
  );
}

export default ClassThumbnailCard;
