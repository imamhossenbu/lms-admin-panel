"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  CheckCircle2,
  Clock,
  Trophy,
  ChevronRight,
  Trash2,
  Calendar,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import { StudentItem } from "@/types/student";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "sonner";
import Image from "next/image";

interface StudentDetailsDrawerProps {
  isOpen: boolean;
  student: StudentItem | null;
  onClose: () => void;
  onEdit: (student: StudentItem) => void;
  onDeleteStudent: (student: StudentItem) => void;
}

type TabKey = "overview" | "courses" | "progress" | "activity";

export function StudentDetailsDrawer({
  isOpen,
  student,
  onClose,
  onEdit,
  onDeleteStudent,
}: StudentDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!student) return null;

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDeleteStudent(student);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end text-left">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-dash"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-white">
              <h2 className="title-medium text-primary-500 font-bold">
                Student Details
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview Banner */}
            <div className="px-5 pt-4 pb-3 flex items-center gap-3.5 bg-white">
              <Avatar
                src={student.avatarUrl}
                name={student.name}
                size={52}
                className="rounded-full ring-2 ring-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="heading-h5 text-primary-500 font-bold truncate">
                  {student.name}
                </h3>
                <p className="body-sm-regular text-primary-300 truncate">
                  {student.email}
                </p>
                <div className="mt-1">
                  <ToneBadge
                    tone={student.status === "Active" ? "green" : "red"}
                    size="sm"
                  >
                    {student.status}
                  </ToneBadge>
                </div>
              </div>
            </div>

            {/* Tabs Bar */}
            <div className="px-5 border-b border-dash flex items-center gap-6 bg-white overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "overview", label: "Overview" },
                  { key: "courses", label: "Enrolled Courses" },
                  { key: "progress", label: "Progress" },
                  { key: "activity", label: "Activity" },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2.5 body-sm-medium whitespace-nowrap border-b-2 transition-all cursor-pointer relative ${
                      isActive
                        ? "text-brand-orange border-brand-orange font-semibold"
                        : "text-primary-400 border-transparent hover:text-primary-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAFBFD]/50">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* 4 Stat Cards Grid (2x2) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Card 1: Enrolled Courses */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-tight">
                          {student.enrolledCoursesCount}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block">
                          Enrolled Courses
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Completed */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-bg text-green flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-tight">
                          {student.completedCoursesCount}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block">
                          Completed
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Watch Time */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-tight">
                          {student.totalWatchTime}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block">
                          Total Watch Time
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Average Score */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-tight">
                          {student.averageScore}%
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block">
                          Average Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Card */}
                  <div className="p-4 rounded-xl border border-dash bg-white shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-dash">
                      <h4 className="title-sm text-primary-500 font-bold">
                        Personal Information
                      </h4>
                      <button
                        type="button"
                        onClick={() => onEdit(student)}
                        className="body-sm-medium text-primary-400 hover:text-brand-orange transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-2 body-sm-regular text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Full Name</span>
                        <span className="text-primary-500 font-medium">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Email</span>
                        <span className="text-primary-500 font-medium font-mono text-[13px]">
                          {student.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Phone</span>
                        <span className="text-primary-500 font-medium">
                          {student.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Join Date</span>
                        <span className="text-primary-500 font-medium">
                          {student.joinDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Status</span>
                        <ToneBadge
                          tone={student.status === "Active" ? "green" : "red"}
                          size="sm"
                        >
                          {student.status}
                        </ToneBadge>
                      </div>
                    </div>
                  </div>

                  {/* Recent Enrollments Card */}
                  <div className="p-4 rounded-xl border border-dash bg-white shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-dash">
                      <h4 className="title-sm text-primary-500 font-bold">
                        Recent Enrollments
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab("courses")}
                        className="body-2xsm-regular text-brand-orange font-semibold hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {student.enrolledCourses.length > 0 ? (
                        student.enrolledCourses.slice(0, 3).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                            onClick={() => setActiveTab("courses")}
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <BookOpen className="w-5 h-5 text-primary-300 m-auto mt-2.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="body-sm-medium text-primary-500 font-semibold truncate block group-hover:text-brand-orange transition-colors">
                                {course.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      course.progress === 100
                                        ? "bg-green"
                                        : "bg-blue"
                                    }`}
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                                <span className="body-2xsm-regular text-primary-400 font-medium">
                                  {course.progress}%
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-primary-300 group-hover:text-primary-500 transition-colors shrink-0" />
                          </div>
                        ))
                      ) : (
                        <p className="body-sm-regular text-primary-300 text-center py-4">
                          No recent enrollments.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remove Student Action Button */}
                  <div className="pt-2">
                    {showDeleteConfirm ? (
                      <div className="p-3 rounded-xl border border-red/30 bg-red-14/10 space-y-2 animate-in fade-in duration-150">
                        <p className="body-sm-medium text-red font-semibold">
                          Are you sure you want to remove this student?
                        </p>
                        <p className="body-2xsm-regular text-primary-400">
                          This will deactivate their access and remove their active enrollments.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg bg-red text-white body-sm-medium font-semibold hover:bg-red-dark transition-colors cursor-pointer"
                          >
                            Yes, Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-1.5 rounded-lg border border-dash bg-white text-primary-400 body-sm-medium hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full py-2.5 px-4 rounded-xl border border-red text-red hover:bg-red-14 body-sm-medium font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red" />
                        <span>Remove Student</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ENROLLED COURSES */}
              {activeTab === "courses" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="title-sm text-primary-500 font-bold">
                      All Courses ({student.enrolledCourses.length})
                    </span>
                  </div>

                  {student.enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                            {course.thumbnailUrl ? (
                              <Image
                                src={course.thumbnailUrl}
                                alt={course.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="w-5 h-5 text-primary-300 m-auto mt-2.5" />
                            )}
                          </div>
                          <div>
                            <h5 className="body-sm-medium text-primary-500 font-bold">
                              {course.title}
                            </h5>
                            <span className="body-2xsm-regular text-primary-300">
                              Instructor: {course.instructor}
                            </span>
                          </div>
                        </div>

                        {course.certificateEarned && (
                          <span className="body-2xsm-regular px-2 py-0.5 rounded bg-green-bg text-green font-semibold flex items-center gap-1 shrink-0">
                            <Award className="w-3 h-3" />
                            <span>Certified</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between body-2xsm-regular text-primary-400">
                          <span>
                            {course.completedLessons}/{course.totalLessons} Lessons
                          </span>
                          <span className="font-semibold text-primary-500">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              course.progress === 100 ? "bg-green" : "bg-blue"
                            }`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: PROGRESS */}
              {activeTab === "progress" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-dash bg-white shadow-2xs space-y-3">
                    <h4 className="title-sm text-primary-500 font-bold">
                      Learning Milestones
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between body-sm-regular mb-1">
                          <span className="text-primary-400">Overall Course Completion</span>
                          <span className="font-semibold text-primary-500">
                            {student.completionRate}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-orange rounded-full"
                            style={{ width: `${student.completionRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dash">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-dash">
                          <span className="body-2xsm-regular text-primary-300 block">
                            Quiz Accuracy
                          </span>
                          <span className="title-sm text-primary-500 font-bold block mt-0.5">
                            {student.averageScore}%
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-dash">
                          <span className="body-2xsm-regular text-primary-300 block">
                            Study Duration
                          </span>
                          <span className="title-sm text-primary-500 font-bold block mt-0.5">
                            {student.totalWatchTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIVITY */}
              {activeTab === "activity" && (
                <div className="space-y-3">
                  <span className="title-sm text-primary-500 font-bold block">
                    Recent Learning Activity
                  </span>

                  {student.recentActivities && student.recentActivities.length > 0 ? (
                    <div className="rounded-xl border border-dash bg-white p-4 shadow-2xs divide-y divide-dash">
                      {student.recentActivities.map((act) => (
                        <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                            {act.iconType === "certificate" ? (
                              <Award className="w-3.5 h-3.5" />
                            ) : act.iconType === "quiz" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="body-sm-medium text-primary-500 font-semibold block">
                              {act.action}
                            </span>
                            {act.details && (
                              <span className="body-2xsm-regular text-primary-300 block">
                                {act.details}
                              </span>
                            )}
                            <span className="body-2xsm-regular text-primary-300 block mt-0.5">
                              {act.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="body-sm-regular text-primary-300 text-center py-6 bg-white rounded-xl border border-dash">
                      No recent activity recorded yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default StudentDetailsDrawer;
