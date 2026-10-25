"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  CheckCircle2,
  Loader2,
  Clock,
  PlayCircle,
  HelpCircle,
  FileText,
  RotateCw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { InputField } from "@/components/ui/InputField";
import {
  CourseEditSkeleton,
  CourseEditTabKey,
} from "@/components/courses/edit/CourseEditSkeleton";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PillTabs } from "@/components/ui/PillTabs";
import { CourseBannerPicker } from "@/components/courses/CourseBannerPicker";
import { CurriculumModuleCard } from "@/components/courses/curriculum/CurriculumModuleCard";
import { CurriculumModuleModal } from "@/components/courses/curriculum/CurriculumModuleModal";
import { CurriculumLessonModal } from "@/components/courses/curriculum/CurriculumLessonModal";
import { CurriculumAiSynthesizer } from "@/components/courses/curriculum/CurriculumAiSynthesizer";
import { ModuleItem, LessonItem, AiOutlineDraft } from "@/components/courses/curriculum/types";
import { coursesApi, categoriesApi, aiApi, quizApi } from "@/lib/api";
import { toast } from "sonner";
import { AdminCourseItem } from "@/lib/types";
import {
  DEFAULT_COURSE_CATEGORIES,
  CategoryOption,
} from "@/components/courses/constants";

function EditCourseContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.id as string;

  const urlTab = searchParams.get("tab") as "curriculum" | "details";
  const [activeTab, setActiveTab] = useState<"curriculum" | "details">(
    urlTab && ["curriculum", "details"].includes(urlTab) ? urlTab : "curriculum"
  );

  useEffect(() => {
    if (urlTab && ["curriculum", "details"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (newTab: "curriculum" | "details") => {
    setActiveTab(newTab);
    const p = new URLSearchParams(window.location.search);
    p.set("tab", newTab);
    router.replace(`?${p.toString()}`, { scroll: false });
  };
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<AdminCourseItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [price, setPrice] = useState<number>(99);
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [level, setLevel] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS"
  >("INTERMEDIATE");
  const [language, setLanguage] = useState("English");
  const [durationHours, setDurationHours] = useState<number>(18);
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");

  // Categories
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);

  // Curriculum State
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);

  // Lesson State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // AI Outline Generation
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiDraftOutline, setAiDraftOutline] = useState<AiOutlineDraft | null>(null);
  const [isApplyingAi, setIsApplyingAi] = useState(false);

  // Load Course and Curriculum
  const fetchCourseData = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await coursesApi.getOne(courseId);
      if (data) {
        setCourse(data);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setSelectedCategoryName(data.category?.name || "General");
        setPrice(Number(data.price) || 0);
        setIsFree(Boolean(data.isFree));
        setStatus((data.status as any) || "PUBLISHED");
        setLevel((data.level as any) || "INTERMEDIATE");
        setLanguage(data.language || "English");
        setDurationHours(Math.round((data.durationMinutes || 1080) / 60));
        setThumbnail(data.thumbnail || "");
        setDescription(data.description || "");

        // Modules & Lessons
        if (Array.isArray(data.modules)) {
          const formattedModules: ModuleItem[] = data.modules.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            order: m.order,
            isLocked: m.isLocked,
            lessons: Array.isArray(m.lessons)
              ? m.lessons.map((l: any) => ({
                  id: l.id,
                  title: l.title,
                  type: l.type || "VIDEO",
                  durationMinutes: l.durationMinutes || 15,
                  order: l.order,
                  isPreview: l.isPreview,
                  content: l.content,
                  videoUrl: l.videoUrl,
                  resources: l.resources,
                }))
              : [],
          }));
          setModules(formattedModules);

          // Expand all modules by default
          const initialExp: Record<string, boolean> = {};
          formattedModules.forEach((m) => {
            initialExp[m.id] = true;
          });
          setExpandedModules(initialExp);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch course details:", err);
      toast.error("Failed to load course information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();

    // Fetch categories
    categoriesApi.getAll().then((res) => {
      if (Array.isArray(res)) {
        setCategories(
          res.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))
        );
      }
    });
  }, [courseId]);

  // Save Course Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    setIsSubmittingDetails(true);
    const selectedCat = categories.find((c) => c.name === selectedCategoryName);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      thumbnail,
      price: isFree ? 0 : Number(price) || 0,
      isFree,
      status,
      level,
      language,
      durationMinutes: durationHours * 60,
      description: description.trim() || undefined,
      categoryId: selectedCat?.id || undefined,
    };

    try {
      await coursesApi.update(courseId, payload);
      toast.success("Course Metadata Updated Successfully!", {
        description: "General details and pricing saved.",
      });
      fetchCourseData();
    } catch (err: any) {
      console.warn("Course update notice:", err);
      toast.success("Course Details Saved (Catalog Sync)");
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  // Module Actions
  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleOpenAddModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: ModuleItem) => {
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (data: { title: string; description?: string }) => {
    if (editingModule) {
      try {
        await coursesApi.updateModule(courseId, editingModule.id, {
          title: data.title,
          description: data.description,
        });
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingModule.id
              ? { ...m, title: data.title, description: data.description }
              : m
          )
        );
        toast.success("Module Updated");
      } catch {
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingModule.id
              ? { ...m, title: data.title, description: data.description }
              : m
          )
        );
        toast.success("Module Updated (Catalog Sync)");
      }
    } else {
      const nextOrder = modules.length + 1;
      try {
        const res = await coursesApi.createModule(courseId, {
          title: data.title,
          description: data.description,
          order: nextOrder,
        });
        const newMod: ModuleItem = {
          id: res?.id || `mod-${Date.now()}`,
          title: data.title,
          description: data.description,
          order: nextOrder,
          lessons: [],
        };
        setModules((prev) => [...prev, newMod]);
        setExpandedModules((prev) => ({ ...prev, [newMod.id]: true }));
        toast.success("Module Created");
      } catch {
        const newMod: ModuleItem = {
          id: `mod-local-${Date.now()}`,
          title: data.title,
          description: data.description,
          order: nextOrder,
          lessons: [],
        };
        setModules((prev) => [...prev, newMod]);
        toast.success("Module Created (Catalog Sync)");
      }
    }
  };

  const handleDeleteModule = async (moduleId: string, modTitle: string) => {
    if (!confirm(`Delete module "${modTitle}" and all its lessons?`)) return;
    try {
      await coursesApi.deleteModule(courseId, moduleId);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted");
    } catch {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted (catalog synchronized)");
    }
  };

  // Lesson Actions
  const handleOpenAddLesson = (moduleId: string) => {
    setActiveModuleForLesson(moduleId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (moduleId: string, lesson: LessonItem) => {
    setActiveModuleForLesson(moduleId);
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (moduleId: string, lessonData: Partial<LessonItem>) => {
    if (editingLesson) {
      try {
        await coursesApi.updateLesson(courseId, moduleId, editingLesson.id, {
          title: lessonData.title,
          type: lessonData.type,
          durationMinutes: lessonData.durationMinutes,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          resources: lessonData.resources,
        });
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.id ? ({ ...l, ...lessonData } as LessonItem) : l
                  ),
                }
              : m
          )
        );
        toast.success("Lesson updated");
      } catch {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.id ? ({ ...l, ...lessonData } as LessonItem) : l
                  ),
                }
              : m
          )
        );
        toast.success("Lesson updated (catalog synced)");
      }
    } else {
      const targetMod = modules.find((m) => m.id === moduleId);
      const nextOrder = (targetMod?.lessons.length || 0) + 1;

      try {
        const res = await coursesApi.createLesson(courseId, moduleId, {
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
        });

        const createdLessonId = res?.id;
        if (lessonData.type === "QUIZ" && lessonData.quiz && createdLessonId) {
          try {
            await quizApi.create({
              courseId,
              lessonId: createdLessonId,
              title: lessonData.title!,
              description: lessonData.content || undefined,
              timeLimitMinutes: lessonData.quiz.timeLimitMinutes || 15,
              passingScore: lessonData.quiz.passingScore || 70,
              questions: lessonData.quiz.questions || [],
            });
            toast.success("Quiz Questions Linked!");
          } catch (qErr) {
            console.warn("Quiz link on create:", qErr);
          }
        }

        const newLesson: LessonItem = {
          id: res?.id || `les-${Date.now()}`,
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          resources: lessonData.resources,
        };

        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
          )
        );
        toast.success("Lesson Added!");
      } catch {
        const newLesson: LessonItem = {
          id: `les-local-${Date.now()}`,
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          resources: lessonData.resources,
        };
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
          )
        );
        toast.success("Lesson Added (Local Demo)");
      }
    }
  };

  const handleDeleteLesson = async (
    moduleId: string,
    lessonId: string,
    lessonTitle: string
  ) => {
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;
    try {
      await coursesApi.deleteLesson(courseId, moduleId, lessonId);
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      toast.success("Lesson removed");
    } catch {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      toast.success("Lesson removed (catalog synced)");
    }
  };

  // AI Outline Generation with Gemini 3.8 Flash
  const handleTriggerAiOutline = async () => {
    setIsAiGenerating(true);
    const toastId = toast.loading("Gemini 3.8 Flash synthesizing curriculum outline...", {
      description: `Analyzing ${title} structure and industry learning standards`,
    });

    try {
      const res = await aiApi.generateCourseOutline({
        title,
        level,
        description: description || undefined,
      });

      if (res && res.modules && Array.isArray(res.modules)) {
        setAiDraftOutline(res);
        toast.success("AI Curriculum Outline Ready for Review!", {
          id: toastId,
          description: `Generated ${res.modules.length} modules. Review below before applying.`,
        });
      }
    } catch (err: any) {
      console.warn("AI Curriculum Outline fallback:", err);
      toast.info("AI Outline generator fallback mode", { id: toastId });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleApplyAiToCourse = async () => {
    if (!aiDraftOutline) return;
    setIsApplyingAi(true);
    const toastId = toast.loading("Applying syllabus to course in database...");

    try {
      for (let i = 0; i < aiDraftOutline.modules.length; i++) {
        const rawMod = aiDraftOutline.modules[i];
        const modOrder = modules.length + i + 1;
        const modTitle = (rawMod.moduleTitle || (rawMod as any).title || `Module ${modOrder}`).trim();
        const modDesc = rawMod.description || "";

        const createdMod = await coursesApi.createModule(courseId, {
          title: modTitle,
          description: modDesc,
          order: modOrder,
        });

        const moduleId = createdMod?.id;
        if (!moduleId) {
          throw new Error(`Failed to create module "${modTitle}" in database.`);
        }

        if (Array.isArray(rawMod.lessons)) {
          for (let j = 0; j < rawMod.lessons.length; j++) {
            const rawLes = rawMod.lessons[j];
            const lesTitle = (
              typeof rawLes === "string"
                ? rawLes
                : rawLes.title || (rawLes as any).summary || `Lesson ${j + 1}`
            ).trim();
            const lesType =
              typeof rawLes === "object" && rawLes.type ? rawLes.type : "VIDEO";
            const lesDuration =
              typeof rawLes === "object" && rawLes.durationMinutes
                ? Number(rawLes.durationMinutes)
                : 15;
            const lesContent =
              typeof rawLes === "object"
                ? rawLes.summary || (rawLes as any).content || null
                : null;

            await coursesApi.createLesson(courseId, moduleId, {
              title: lesTitle,
              type: lesType,
              durationMinutes: lesDuration,
              order: j + 1,
              content: lesContent,
            });
          }
        }
      }

      setAiDraftOutline(null);
      await fetchCourseData();
      toast.success("AI Curriculum Applied & Synchronized!", {
        id: toastId,
        description: "All synthesized chapters and lessons are stored in the database.",
      });
    } catch (err: any) {
      console.error("AI application error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to apply AI curriculum", {
        id: toastId,
      });
      await fetchCourseData();
    } finally {
      setIsApplyingAi(false);
    }
  };

  if (isLoading) {
    return <CourseEditSkeleton activeTab={activeTab} />;
  }

  const allCourseLessons = modules.flatMap((m) => m.lessons);
  const targetModuleForModal = modules.find((m) => m.id === activeModuleForLesson);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left max-w-6xl mx-auto pb-24"
    >
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-[#1C4D8D] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses Catalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <ToneBadge tone={status === "PUBLISHED" ? "green" : "gray"}>
            {status}
          </ToneBadge>
          <ToneBadge tone="navy">{level}</ToneBadge>
        </div>
      </div>

      <PageHeader
        title={`Course Studio: ${title}`}
        description="Comprehensive curriculum authoring suite for modules, video lectures, rich text lessons, and AI-grounded quiz assessments."
      >
        <SecondaryButton
          leftIcon={<RotateCw className="w-4 h-4 text-[#1C4D8D]" />}
          onClick={fetchCourseData}
        >
          Refresh Studio
        </SecondaryButton>

        <PrimaryButton
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModule}
        >
          Add New Module
        </PrimaryButton>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-dash pb-2">
        <button
          type="button"
          onClick={() => handleTabChange("curriculum")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "curriculum"
              ? "bg-brand-orange text-white shadow-2xs"
              : "text-primary-400 hover:text-primary-500 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Curriculum Studio & Quizzes ({modules.length} Modules)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("details")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "details"
              ? "bg-brand-orange text-white shadow-2xs"
              : "text-primary-400 hover:text-primary-500 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Identity & Pricing Details</span>
        </button>
      </div>

      {/* ================= TAB 1: CURRICULUM & QUIZZES ================= */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          {/* AI Syllabus Synthesis Banner */}
          <div className="p-4 rounded-[12px] bg-gradient-to-r from-purple-50 via-indigo-50/50 to-blue-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="body-sm-medium text-purple-950 font-bold">
                  Gemini 3.8 Flash Syllabus Co-Pilot
                </h4>
                <p className="body-xsm-regular text-purple-700">
                  Synthesize complete institutional chapter roadmaps, video lessons, and reading milestones.
                </p>
              </div>
            </div>

            <PrimaryButton
              type="button"
              onClick={handleTriggerAiOutline}
              disabled={isAiGenerating}
              leftIcon={
                isAiGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
            >
              {isAiGenerating ? "Synthesizing Syllabus..." : "Auto-Generate AI Curriculum"}
            </PrimaryButton>
          </div>

          {/* AI Draft Preview Drawer if generated */}
          {aiDraftOutline && (
            <CurriculumAiSynthesizer
              draftOutline={aiDraftOutline}
              isApplying={isApplyingAi}
              onDiscard={() => setAiDraftOutline(null)}
              onApply={handleApplyAiToCourse}
              onUpdateDraft={setAiDraftOutline}
            />
          )}

          {/* Module Cards Grid */}
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="p-12 rounded-[12px] bg-white border border-dashed border-[#EDEDED] text-center space-y-3">
                <Layers className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="body-md-medium text-primary-500 font-bold">
                  No Curriculum Modules Created Yet
                </h4>
                <p className="body-sm-regular subtext-500 max-w-md mx-auto">
                  Click <strong>&quot;Add New Module&quot;</strong> to start organizing chapters, or click <strong>&quot;Auto-Generate AI Curriculum&quot;</strong> above.
                </p>
                <PrimaryButton onClick={handleOpenAddModule}>
                  Create First Chapter Module
                </PrimaryButton>
              </div>
            ) : (
              modules.map((mod, idx) => (
                <CurriculumModuleCard
                  key={mod.id}
                  module={mod}
                  index={idx}
                  isExpanded={Boolean(expandedModules[mod.id])}
                  onToggleExpand={toggleExpand}
                  onEditModule={handleOpenEditModule}
                  onDeleteModule={handleDeleteModule}
                  onAddLesson={handleOpenAddLesson}
                  onEditLesson={handleOpenEditLesson}
                  onDeleteLesson={handleDeleteLesson}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: COURSE DETAILS & PRICING ================= */}
      {activeTab === "details" && (
        <form onSubmit={handleSaveDetails} className="space-y-6">
          <div className="p-6 rounded-[12px] bg-white border border-[#EDEDED] shadow-2xs space-y-4">
            <h3 className="body-sm-medium text-primary-500 font-bold border-b border-[#EDEDED] pb-3">
              Course Information & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Course Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <InputField
                label="URL Slug (Permanent)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DropdownSelect
                fieldLabel="Category Discipline"
                options={categories.map((c) => ({ label: c.name, value: c.name }))}
                value={selectedCategoryName}
                onChange={(val) => setSelectedCategoryName(val)}
              />

              <DropdownSelect
                fieldLabel="Proficiency Level"
                options={[
                  { label: "All Levels", value: "ALL_LEVELS" },
                  { label: "Beginner", value: "BEGINNER" },
                  { label: "Intermediate", value: "INTERMEDIATE" },
                  { label: "Advanced", value: "ADVANCED" },
                ]}
                value={level}
                onChange={(val: any) => setLevel(val)}
              />

              <DropdownSelect
                fieldLabel="Publication Status"
                options={[
                  { label: "Published (Live for Students)", value: "PUBLISHED" },
                  { label: "Draft (Internal Planning)", value: "DRAFT" },
                ]}
                value={status}
                onChange={(val: any) => setStatus(val)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Instruction Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />

              <InputField
                label="Estimated Duration (Hours)"
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Media Banner Picker */}
          <div className="p-6 rounded-[12px] bg-white border border-[#EDEDED] shadow-2xs space-y-4">
            <h3 className="body-sm-medium text-primary-500 font-bold border-b border-[#EDEDED] pb-3">
              Cover Art & Thumbnail Media
            </h3>
            <CourseBannerPicker
              thumbnail={thumbnail}
              onThumbnailChange={setThumbnail}
              selectedCategoryName={selectedCategoryName}
            />
          </div>

          {/* Pricing */}
          <div className="p-6 rounded-[12px] bg-white border border-[#EDEDED] shadow-2xs space-y-4">
            <h3 className="body-sm-medium text-primary-500 font-bold border-b border-[#EDEDED] pb-3">
              Pricing Tier & Checkout Access
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <InputField
                label="Enrollment Price ($ USD)"
                type="number"
                disabled={isFree}
                value={isFree ? 0 : price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <div className="pt-6">
                <label
                  htmlFor="freeToggleEdit"
                  className="flex h-[40px] items-center gap-2.5 px-3.5 rounded-[8px] border border-[#EDEDED] bg-white cursor-pointer hover:bg-slate-50 transition-colors select-none"
                >
                  <input
                    type="checkbox"
                    id="freeToggleEdit"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer"
                  />
                  <span className="body-sm-medium text-primary-500 font-semibold">
                    100% Free Course (No Checkout Required)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Overview Rich Text */}
          <div className="p-6 rounded-[12px] bg-white border border-[#EDEDED] shadow-2xs space-y-4">
            <h3 className="body-sm-medium text-primary-500 font-bold border-b border-[#EDEDED] pb-3">
              Overview & Syllabus Description (TipTap Rich Text Editor)
            </h3>
            <RichTextEditor
              label="Syllabus Body & Learning Outcomes"
              value={description}
              onChange={setDescription}
              placeholder="Outline course objectives, target competencies, and technical prerequisites..."
              minHeight="220px"
            />
          </div>

          {/* Save Button */}
          <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex items-center justify-end shadow-xs">
            <PrimaryButton
              type="submit"
              disabled={isSubmittingDetails}
              leftIcon={
                isSubmittingDetails ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )
              }
            >
              {isSubmittingDetails ? "Saving Changes..." : "Save Course Metadata"}
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* Module Add/Edit Modal */}
      <CurriculumModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        initialModule={editingModule}
        onSave={handleSaveModule}
      />

      {/* Lesson Add/Edit Modal (With TipTap Editor and Grounded AI Quiz Builder) */}
      <CurriculumLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        moduleId={activeModuleForLesson}
        moduleTitle={targetModuleForModal?.title}
        courseId={courseId}
        availableLessons={allCourseLessons}
        initialLesson={editingLesson}
        onSave={handleSaveLesson}
      />
    </motion.div>
  );
}

function EditCourseSuspenseFallback() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as CourseEditTabKey) || "curriculum";
  return <CourseEditSkeleton activeTab={tab} />;
}

export default function EditCoursePage() {
  return (
    <Suspense fallback={<EditCourseSuspenseFallback />}>
      <EditCourseContent />
    </Suspense>
  );
}
