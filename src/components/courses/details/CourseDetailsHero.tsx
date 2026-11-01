"use client";

import React from "react";
import Image from "next/image";
import { AdminCourseItem } from "@/lib/types";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import { Avatar } from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/primary-button";
import {
  Users,
  Star,
  Globe,
  PlayCircle,
  Edit3,
} from "lucide-react";
import { SVG_FALLBACK } from "../constants";

interface CourseDetailsHeroProps {
  course: AdminCourseItem;
  formattedHours: string;
  onClose?: () => void;
  onEditCourse?: (course: AdminCourseItem) => void;
  onOpenAiOutline?: (course: AdminCourseItem) => void;
  onManageCurriculum?: (course: AdminCourseItem) => void;
}

export function CourseDetailsHero({
  course,
  formattedHours,
  onClose,
  onEditCourse,
  onOpenAiOutline,
  onManageCurriculum,
}: CourseDetailsHeroProps) {
  const fallbackBanner =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="relative rounded-xl overflow-hidden border border-dash bg-primary-500 text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Banner Image Preview */}
        <div className="md:col-span-5 relative min-h-55 md:min-h-full bg-primary-500 overflow-hidden">
          <Image
            src={fallbackBanner}
            alt={course.title}
            fill
            unoptimized
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = SVG_FALLBACK;
            }}
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-500 via-transparent to-black/30" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <TagBadge
              tag={course.category?.name || "Engineering"}
              bgColor="bg-white/90 backdrop-blur-md"
              textColor="text-primary-500"
            />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white body-xsm-medium">
            <PlayCircle className="w-3.5 h-3.5 text-white/80" />
            <span>{formattedHours} on-demand video</span>
          </div>
        </div>

        {/* Course Summary & Key Stats */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <ToneBadge
                tone={course.status === "PUBLISHED" ? "success" : "orange"}
                size="sm"
                className="uppercase tracking-wider"
              >
                {course.status}
              </ToneBadge>
              <span className="body-xsm-medium text-white/85 bg-white/10 px-2 py-0.5 rounded">
                {course.level || "Intermediate"}
              </span>
              <span className="body-xsm-medium text-white/85 bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>English</span>
              </span>
            </div>

            <h2 className="title-medium text-white">
              {course.title}
            </h2>
            <p className="body-sm-regular text-white/75 mt-2 line-clamp-2">
              {course.description ||
                "Comprehensive professional masterclass designed with modular learning phases, live quizzes, and industry-standard architecture exercises."}
            </p>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-left">
            <div>
              <span className="body-xsm-regular text-white/60 block">
                Enrolled Students
              </span>
              <span className="body-sm-medium text-white flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-white/80" />
                {course.totalStudents.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="body-xsm-regular text-white/60 block">
                Student Rating
              </span>
              <span className="body-sm-medium text-yellow flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow text-yellow" />
                {course.ratingAverage > 0 ? course.ratingAverage : "5.0"}
              </span>
            </div>
            <div>
              <span className="body-xsm-regular text-white/60 block">
                Catalog Price
              </span>
              <span className="body-sm-medium text-green mt-0.5 block">
                {course.isFree ? "Free Access" : `$${course.price}`}
              </span>
            </div>
          </div>

          {/* Instructor Information & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar name={course.instructorName || "Faculty"} size="sm" />
              <div>
                <span className="body-sm-medium text-white block">
                  {course.instructorName || "Lead Technical Faculty"}
                </span>
                <span className="body-xsm-regular text-white/60">
                  Verified Instructor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onEditCourse && (
                <PrimaryButton
                  size="sm"
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onClose?.();
                    onEditCourse(course);
                  }}
                  className="bg-white text-primary-500 hover:bg-slate-100 border-none"
                >
                  Edit Course in Studio
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
