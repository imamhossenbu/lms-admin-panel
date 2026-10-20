"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Users,
  Star,
  BookOpen,
  Sparkles,
  Trash2,
  Edit3,
  PlayCircle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import { RowActionButton } from "@/components/ui/RowActionButton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { motion } from "framer-motion";
import { AdminCourseItem } from "@/lib/types";

interface CourseCardProps {
  course: AdminCourseItem;
  onEdit?: (course: AdminCourseItem) => void;
  onDelete?: (id: string) => void;
  onGenerateOutline?: (course: AdminCourseItem) => void;
  onViewDetails?: (course: AdminCourseItem) => void;
  onManageCurriculum?: (course: AdminCourseItem) => void;
}

// Fallback banner mapping based on category or slug
const FALLBACK_BANNERS: Record<string, string> = {
  "Artificial Intelligence":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
  "Fullstack Web":
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
  "Cloud & DevOps":
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
  "Software Engineering":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  Cybersecurity:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
};

export function CourseCard({
  course,
  onEdit,
  onDelete,
  onGenerateOutline,
  onViewDetails,
  onManageCurriculum,
}: CourseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const bannerImage =
    course.thumbnail ||
    (course.category?.name && FALLBACK_BANNERS[course.category.name]) ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop";

  const menuItems = [
    {
      label: "Manage Curriculum & Lessons",
      icon: <Layers className="w-4 h-4 text-[#1C4D8D]" />,
      onClick: () => onManageCurriculum?.(course),
      className: "font-bold text-[#1C4D8D] bg-blue-50/50",
    },
    {
      label: "View Syllabus & Details",
      icon: <PlayCircle className="w-4 h-4 text-primary-400" />,
      onClick: () => onViewDetails?.(course),
    },
    {
      label: "AI Syllabus Builder",
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      onClick: () => onGenerateOutline?.(course),
      className: "text-purple-700 hover:bg-purple-50",
    },
    {
      label: "Edit Course Metadata",
      icon: <Edit3 className="w-4 h-4 text-primary-300" />,
      onClick: () => onEdit?.(course),
    },
    {
      label: "Archive Course",
      icon: <Trash2 className="w-4 h-4 text-rose-500" />,
      onClick: () => onDelete?.(course.id),
      className: "text-rose-600 hover:bg-rose-50",
    },
  ];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      onClick={() => onViewDetails?.(course)}
      style={{
        boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)",
      }}
      className="rounded-[14px] border border-[#EDEDED] bg-white overflow-hidden flex flex-col justify-between text-left transition-all duration-200 hover:border-[#1C4D8D]/40 hover:shadow-lg group cursor-pointer"
    >
      <div>
        {/* ================= 1. 16:9 BANNER IMAGE (Coursera & Udemy Style) ================= */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
          <Image
            src={bannerImage}
            alt={course.title}
            fill
            unoptimized
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop";
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Floating Category Tag Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <TagBadge
              tag={course.category?.name || "General"}
              bgColor="bg-white/95 backdrop-blur-md shadow-xs"
              textColor="text-primary-500 font-semibold"
            />
          </div>

          {/* Top-Right 3-Dot Dropdown Menu Button */}
          <div
            className="absolute top-2.5 right-2.5 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <RowActionButton
              ref={buttonRef}
              label="Course options"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-8 w-8 rounded-[8px] border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-black/70 hover:text-white"
            />
            <DropdownMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              items={menuItems}
              anchorEl={buttonRef.current}
            />
          </div>

          {/* Bottom Floating Info Pills */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="body-xsm-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-sky-200 flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{course.level || "Intermediate"}</span>
            </span>

            <ToneBadge
              tone={course.status === "PUBLISHED" ? "green" : "orange"}
              className="body-xsm-medium uppercase tracking-wider bg-white/90 shadow-2xs font-bold"
            >
              {course.status}
            </ToneBadge>
          </div>
        </div>

        {/* ================= 2. COURSE CONTENT BODY ================= */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="body-medium text-primary-500 font-semibold leading-snug line-clamp-2 group-hover:text-[#1C4D8D] transition-colors">
            {course.title}
          </h3>

          {/* Instructor Profile */}
          <div className="flex items-center gap-2">
            <Avatar name={course.instructorName || "Instructor"} size="sm" />
            <span className="body-sm-regular subtext-500 truncate">
              {course.instructorName || "Faculty Instructor"}
            </span>
          </div>

          {/* Ratings & Enrolled Learners */}
          <div className="flex items-center justify-between pt-1 body-xsm-regular subtext-500">
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-amber-600 font-bold body-sm-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{course.ratingAverage > 0 ? course.ratingAverage : "5.0"}</span>
              </span>
              <span className="text-[#969696]">•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary-300" />
                <span>{course.totalStudents.toLocaleString()} learners</span>
              </span>
            </div>

            <span className="flex items-center gap-1 text-[#1C4D8D] body-xsm-medium font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Syllabus</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. CARD FOOTER ================= */}
      <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#EDEDED] flex items-center justify-between">
        <span className="body-xsm-regular subtext-500 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-primary-300" />
          <span>Modular Syllabus</span>
        </span>

        <div className="text-right">
          {course.isFree ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-[#e6ffee] text-[#0dc34a] body-sm-medium font-bold">
              FREE
            </span>
          ) : (
            <span className="h6-medium text-primary-500 font-bold">
              ${course.price}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;
