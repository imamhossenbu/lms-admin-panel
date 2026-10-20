"use client";

import React, { useState, useRef } from "react";
import { Users, Star, BookOpen, Sparkles, Trash2, Edit3 } from "lucide-react";
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
}

export function CourseCard({
  course,
  onEdit,
  onDelete,
  onGenerateOutline,
}: CourseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuItems = [
    {
      label: "AI Syllabus Builder",
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      onClick: () => onGenerateOutline?.(course),
      className: "text-purple-700 hover:bg-purple-50",
    },
    {
      label: "Edit Course",
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
      style={{
        boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)",
      }}
      className="rounded-[12px] border border-[#EDEDED] bg-white p-5 flex flex-col justify-between text-left transition-all duration-200 hover:border-[#1C4D8D]/40 hover:shadow-md"
    >
      <div>
        {/* Top Header Row: Category Badge + Status Badge + 3-Dot Options Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <TagBadge
              tag={course.category?.name || "General"}
              bgColor="bg-[#F5F7FA]"
              textColor="text-primary-500"
            />
            <ToneBadge
              tone={course.status === "PUBLISHED" ? "green" : "orange"}
              className="body-xsm-medium uppercase tracking-wider"
            >
              {course.status}
            </ToneBadge>
          </div>

          {/* Action Menu Button */}
          <div onClick={(e) => e.stopPropagation()}>
            <RowActionButton
              ref={buttonRef}
              label="Course options"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-8 w-8 rounded-[8px] border border-[#EDEDED] bg-white text-primary-300 hover:text-primary-500 hover:bg-[#F8F9FA]"
            />
            <DropdownMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              items={menuItems}
              anchorEl={buttonRef.current}
            />
          </div>
        </div>

        {/* Course Info Block with Icon */}
        <div className="flex items-start gap-3.5 mt-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#EBF4FC] border border-[#BDE8F5]/60 flex items-center justify-center text-[#1C4D8D] shrink-0">
            <BookOpen className="w-5 h-5 text-[#1C4D8D]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="body-medium text-primary-500 font-semibold leading-snug line-clamp-2 hover:text-[#1C4D8D] transition-colors">
              {course.title}
            </h3>
            {/* Instructor */}
            <div className="flex items-center gap-2 mt-2">
              <Avatar name={course.instructorName || "Instructor"} size="sm" />
              <span className="body-sm-regular subtext-500 truncate">
                {course.instructorName || "Faculty Instructor"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Stats + Price */}
      <div className="pt-4 mt-4 border-t border-[#F0F0F0] flex items-center justify-between">
        <div className="flex items-center gap-3.5 body-sm-regular subtext-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary-300" />
            <span>{course.totalStudents.toLocaleString()}</span>
          </span>

          {course.ratingAverage > 0 && (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{course.ratingAverage}</span>
            </span>
          )}
        </div>

        <div className="text-right">
          {course.isFree ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-[#e6ffee] text-[#0dc34a] body-sm-medium font-semibold">
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
