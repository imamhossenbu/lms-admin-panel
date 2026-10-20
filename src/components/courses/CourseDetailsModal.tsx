"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ModalShell } from "@/components/ui/ModalShell";
import { PillTabs } from "@/components/ui/PillTabs";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import { Avatar } from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCourseItem, CourseModuleItem, CourseLessonItem } from "@/lib/types";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Award,
  Video,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  PlayCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ShieldCheck,
  Globe,
  BarChart,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CourseDetailsModalProps {
  course: AdminCourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiOutline?: (course: AdminCourseItem) => void;
  onManageCurriculum?: (course: AdminCourseItem) => void;
}

export function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  onOpenAiOutline,
  onManageCurriculum,
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
  });

  if (!course) return null;

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // High-fidelity fallback curriculum if course modules not yet seeded from backend
  const displayModules: CourseModuleItem[] =
    course.modules && course.modules.length > 0
      ? course.modules
      : [
          {
            id: "mod-1",
            title: "Module 1: Foundations & Architecture Design",
            description: "Core architectural paradigms, environment setup, and framework fundamentals.",
            order: 1,
            durationMinutes: 145,
            lessons: [
              {
                id: "les-1",
                title: "01. Introduction to Enterprise Architecture & Course Roadmap",
                type: "VIDEO",
                durationMinutes: 18,
                order: 1,
                isPreview: true,
                videoUrl: "https://youtube.com/watch?v=demo1",
              },
              {
                id: "les-2",
                title: "02. Setting up Turbopack, TypeScript 6 & Workspace Schemas",
                type: "VIDEO",
                durationMinutes: 24,
                order: 2,
                isPreview: true,
              },
              {
                id: "les-3",
                title: "03. Component Tree Lifecycle & Server Actions Optimization",
                type: "VIDEO",
                durationMinutes: 32,
                order: 3,
                isPreview: false,
              },
              {
                id: "les-4",
                title: "04. Module Diagnostic Quiz & Architecture Exercise",
                type: "QUIZ",
                durationMinutes: 20,
                order: 4,
                isPreview: false,
              },
            ],
          },
          {
            id: "mod-2",
            title: "Module 2: Advanced Telemetry, State & AI Orchestration",
            description: "Production telemetry pipelines, sub-second inference, and PostgreSQL pooling.",
            order: 2,
            durationMinutes: 210,
            lessons: [
              {
                id: "les-5",
                title: "05. Microservices Authentication with Zero-Trust Tokens",
                type: "VIDEO",
                durationMinutes: 28,
                order: 1,
                isPreview: false,
              },
              {
                id: "les-6",
                title: "06. Gemini 3.8 Flash Dual-Engine Streaming Pipeline",
                type: "VIDEO",
                durationMinutes: 35,
                order: 2,
                isPreview: false,
              },
              {
                id: "les-7",
                title: "07. Database Connection Pooling with Neon Serverless pg-pool",
                type: "VIDEO",
                durationMinutes: 30,
                order: 3,
                isPreview: false,
              },
              {
                id: "les-8",
                title: "08. Capstone Production Deployment & Automated CI/CD",
                type: "ARTICLE",
                durationMinutes: 45,
                order: 4,
                isPreview: false,
              },
            ],
          },
        ];

  const totalLessons = displayModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDurationMinutes = displayModules.reduce(
    (acc, m) =>
      acc + (m.durationMinutes || m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0)),
    0
  );
  const formattedHours = `${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m`;

  const SVG_FALLBACK =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231C4D8D'/%3E%3Cstop offset='100%25' stop-color='%230F2854'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-family='sans-serif' font-size='26' font-weight='600' text-anchor='middle' dy='.3em'%3ECourse Curriculum%3C/text%3E%3C/svg%3E";

  const fallbackBanner =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`Curriculum ID: ${course.id} • Category: ${course.category?.name || "General"}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left">
        {/* ================= HERO COURSE BANNER & META ================= */}
        <div className="relative rounded-[14px] overflow-hidden border border-[#EDEDED] bg-[#0F2854] text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Banner Image Preview (16:9 ratio style) */}
            <div className="md:col-span-5 relative min-h-[220px] md:min-h-full bg-slate-900 overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2854] via-transparent to-black/30" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <TagBadge
                  tag={course.category?.name || "Engineering"}
                  bgColor="bg-white/90 backdrop-blur-md"
                  textColor="text-[#0E2038] font-bold"
                />
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white body-xsm-medium">
                <PlayCircle className="w-3.5 h-3.5 text-sky-300" />
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
                    className="font-bold uppercase tracking-wider"
                  >
                    {course.status}
                  </ToneBadge>
                  <span className="body-xsm-medium text-sky-200 bg-white/10 px-2 py-0.5 rounded">
                    {course.level || "Intermediate"}
                  </span>
                  <span className="body-xsm-medium text-sky-200 bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>English</span>
                  </span>
                </div>

                <h2 className="title-medium text-white font-bold leading-snug">
                  {course.title}
                </h2>
                <p className="body-sm-regular text-slate-300 mt-2 line-clamp-2">
                  {course.description ||
                    "Comprehensive professional masterclass designed with modular learning phases, live quizzes, and industry-standard architecture exercises."}
                </p>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-left">
                <div>
                  <span className="body-xsm-regular text-slate-400 block">Enrolled Students</span>
                  <span className="body-sm-medium text-white font-bold flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-sky-300" />
                    {course.totalStudents.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="body-xsm-regular text-slate-400 block">Student Rating</span>
                  <span className="body-sm-medium text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {course.ratingAverage > 0 ? course.ratingAverage : "5.0"}
                  </span>
                </div>
                <div>
                  <span className="body-xsm-regular text-slate-400 block">Catalog Price</span>
                  <span className="body-sm-medium text-emerald-300 font-bold mt-0.5 block">
                    {course.isFree ? "Free Access" : `$${course.price}`}
                  </span>
                </div>
              </div>

              {/* Instructor Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={course.instructorName || "Faculty"} size="sm" />
                  <div>
                    <span className="body-sm-medium text-white font-semibold block leading-tight">
                      {course.instructorName || "Lead Technical Faculty"}
                    </span>
                    <span className="body-xsm-regular text-slate-400">Verified Instructor</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SecondaryButton
                    size="sm"
                    leftIcon={<Layers className="w-3.5 h-3.5 text-[#1C4D8D]" />}
                    onClick={() => {
                      onClose();
                      onManageCurriculum?.(course);
                    }}
                  >
                    Edit Curriculum
                  </SecondaryButton>
                  <SecondaryButton
                    size="sm"
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                    onClick={() => onOpenAiOutline?.(course)}
                  >
                    AI Syllabus
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION PILL TABS ================= */}
        <PillTabs
          activeId={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "syllabus", label: `Curriculum & Syllabus (${totalLessons} Lessons)` },
            { id: "outcomes", label: "Learning Outcomes & Prerequisites" },
            { id: "learners", label: `Enrolled Students (${course.totalStudents})` },
          ]}
        />

        {/* ================= TAB 1: SYLLABUS & CURRICULUM ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="body-medium text-primary-500 font-semibold">
                  Course Content & Modular Structure
                </h3>
                <p className="body-xsm-regular subtext-500 mt-0.5">
                  {displayModules.length} Modules • {totalLessons} Lessons • {formattedHours} Total
                  Length
                </p>
              </div>
              <SecondaryButton
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() =>
                  toast.info("Add Module", {
                    description: "You can append lessons or import AI generated syllabi.",
                  })
                }
              >
                Add Module
              </SecondaryButton>
            </div>

            {/* Accordion List of Modules */}
            <div className="space-y-3">
              {displayModules.map((module, mIdx) => {
                const isExpanded = !!expandedModules[module.id];
                return (
                  <div
                    key={module.id}
                    className="rounded-[10px] border border-[#EDEDED] bg-white overflow-hidden"
                  >
                    {/* Module Header Bar */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] hover:bg-[#F3F4F6] transition-colors flex items-center justify-between text-left cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-[#EBF4FC] text-[#1C4D8D] font-bold text-xs flex items-center justify-center shrink-0">
                          {mIdx + 1}
                        </span>
                        <div>
                          <span className="body-sm-medium text-primary-500 font-bold block">
                            {module.title}
                          </span>
                          <span className="body-xsm-regular subtext-500">
                            {module.lessons.length} lectures • {Math.round(module.durationMinutes || 45)} mins
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-primary-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-primary-300" />
                        )}
                      </div>
                    </button>

                    {/* Lesson Items inside Module */}
                    {isExpanded && (
                      <div className="divide-y divide-[#EDEDED] px-4 py-1">
                        {module.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="py-2.5 flex items-center justify-between gap-3 text-left hover:bg-gray-50/50 px-2 rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {lesson.type === "QUIZ" ? (
                                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                              ) : lesson.type === "ARTICLE" ? (
                                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                              ) : (
                                <Video className="w-4 h-4 text-[#1C4D8D] shrink-0" />
                              )}
                              <span className="body-sm-regular text-primary-500 truncate">
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isPreview && (
                                <span className="body-xsm-medium font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Free Preview
                                </span>
                              )}
                              <span className="body-xsm-regular subtext-500 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-primary-300" />
                                {lesson.durationMinutes}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: LEARNING OUTCOMES ================= */}
        {activeTab === "outcomes" && (
          <div className="space-y-5">
            {/* What you'll learn */}
            <div className="p-5 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
              <h4 className="body-medium text-primary-500 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>What Students Will Learn in this Curriculum</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {[
                  "Architect and scale production React 19 & Next.js 16 fullstack apps",
                  "Integrate Gemini 3.8 Flash SDK for real-time AI lesson compilation",
                  "Design secure JWT RBAC authentication tokens with cryptographic invalidation",
                  "Implement resilient PostgreSQL connection pools preventing idle socket dropouts",
                  "Configure SSLCommerz and Stripe payment webhooks with automated invoicing",
                  "Deploy high-performance containerized microservices to cloud clusters",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="body-sm-regular text-primary-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="p-5 rounded-[12px] border border-[#EDEDED] bg-white space-y-3">
              <h4 className="body-medium text-primary-500 font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1C4D8D]" />
                <span>Prerequisites & Requirements</span>
              </h4>
              <ul className="space-y-2 list-disc list-inside body-sm-regular subtext-500 pl-1">
                <li>Basic familiarity with JavaScript / TypeScript syntax and Node.js.</li>
                <li>Understanding of fundamental REST APIs and database concepts.</li>
                <li>A computer with Node.js 20+ installed and a code editor (VS Code or Antigravity).</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ENROLLED STUDENTS ================= */}
        {activeTab === "learners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="body-medium text-primary-500 font-semibold">
                  Verified Institutional Enrollments
                </h4>
                <p className="body-xsm-regular subtext-500">
                  Tracking active learner velocity, progress benchmarks, and completion rates
                </p>
              </div>
              <span className="body-xsm-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                98.4% Retention Rate
              </span>
            </div>

            <div className="rounded-[10px] border border-[#EDEDED] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-[#EDEDED]">
                  <tr>
                    <th className="py-2.5 px-4 body-xsm-medium-inter subtext-500">Student Name</th>
                    <th className="py-2.5 px-4 body-xsm-medium-inter subtext-500">Email</th>
                    <th className="py-2.5 px-4 body-xsm-medium-inter subtext-500">Curriculum Progress</th>
                    <th className="py-2.5 px-4 body-xsm-medium-inter subtext-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEDED] bg-white">
                  {[
                    { name: "Tanvir Ahmed", email: "tanvir@example.com", progress: 92, status: "Active" },
                    { name: "Nusrat Jahan", email: "nusrat@example.com", progress: 68, status: "Active" },
                    { name: "Rafiqul Islam", email: "rafiq@example.com", progress: 100, status: "Certified" },
                    { name: "Sadia Rahman", email: "sadia@example.com", progress: 45, status: "Active" },
                    { name: "Arif Hossain", email: "arif@example.com", progress: 84, status: "Active" },
                  ].map((stu, sIdx) => (
                    <tr key={sIdx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 body-sm-medium text-primary-500 font-semibold">
                        <div className="flex items-center gap-2">
                          <Avatar name={stu.name} size="sm" />
                          <span>{stu.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 body-sm-regular subtext-500">{stu.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full bg-[#1C4D8D] rounded-full"
                              style={{ width: `${stu.progress}%` }}
                            />
                          </div>
                          <span className="body-xsm-medium text-primary-500 font-mono">
                            {stu.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ToneBadge
                          tone={stu.status === "Certified" ? "primary" : "success"}
                          size="sm"
                        >
                          {stu.status}
                        </ToneBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

export default CourseDetailsModal;
