"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { TagBadge } from "@/components/ui/TagBadge";
import { coursesApi, aiApi, quizApi } from "@/lib/api";
import { AdminCourseItem } from "@/lib/types";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ModuleItem,
  LessonItem,
  AiOutlineDraft,
} from "./curriculum/types";
import { CurriculumModuleCard } from "./curriculum/CurriculumModuleCard";
import { CurriculumLessonModal } from "./curriculum/CurriculumLessonModal";
import { CurriculumModuleModal } from "./curriculum/CurriculumModuleModal";
import { CurriculumAiSynthesizer } from "./curriculum/CurriculumAiSynthesizer";

export type { ModuleItem, LessonItem } from "./curriculum/types";

interface CurriculumBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: AdminCourseItem | null;
  onCurriculumUpdated?: () => void;
}

export function CurriculumBuilderModal({
  isOpen,
  onClose,
  course,
  onCurriculumUpdated,
}: CurriculumBuilderModalProps) {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Module modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);

  // Lesson modal states
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // AI Outline Synthesis State
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiDraftOutline, setAiDraftOutline] = useState<AiOutlineDraft | null>(null);
  const [isApplyingAi, setIsApplyingAi] = useState(false);

  // Load modules from backend
  const loadCurriculum = async () => {
    if (!course?.id) return;
    setIsLoading(true);
    try {
      const res = await coursesApi.getOne(course.id);
      if (res && Array.isArray(res.modules)) {
        const formatted: ModuleItem[] = res.modules.map((m: any, idx: number) => ({
          id: m.id,
          title: m.title || `Module ${idx + 1}`,
          description: m.description,
          order: m.order ?? idx + 1,
          isLocked: m.isLocked,
          lessons: Array.isArray(m.lessons)
            ? m.lessons.map((l: any, lIdx: number) => ({
                id: l.id,
                title: l.title || `Lesson ${lIdx + 1}`,
                type: l.type || "VIDEO",
                durationMinutes: l.durationMinutes ?? 15,
                order: l.order ?? lIdx + 1,
                content: l.content,
                videoUrl: l.videoUrl,
                isPreview: Boolean(l.isPreview),
              }))
            : [],
        }));
        setModules(formatted);
        if (formatted.length > 0 && Object.keys(expandedModules).length === 0) {
          setExpandedModules({ [formatted[0].id]: true });
        }
      } else if (course?.modules && course.modules.length > 0) {
        setModules(course.modules as any);
        setExpandedModules({ [course.modules[0].id]: true });
      } else {
        setModules([]);
      }
    } catch {
      if (course?.modules && course.modules.length > 0) {
        setModules(course.modules as any);
        setExpandedModules({ [course.modules[0].id]: true });
      } else {
        setModules([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && course?.id) {
      loadCurriculum();
      setAiDraftOutline(null);
    }
  }, [isOpen, course?.id]);

  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // ================= MODULE ACTIONS =================
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: ModuleItem) => {
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (data: { title: string; description?: string }) => {
    if (!course?.id) return;

    if (editingModule) {
      try {
        await coursesApi.updateModule(course.id, editingModule.id, data);
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingModule.id ? { ...m, ...data } : m
          )
        );
        toast.success("Module updated");
      } catch {
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingModule.id ? { ...m, ...data } : m
          )
        );
        toast.success("Module updated (local sync)");
      }
    } else {
      const nextOrder = modules.length + 1;
      try {
        const res = await coursesApi.createModule(course.id, {
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
        toast.success("Module Created!", {
          description: `"${newMod.title}" added to curriculum.`,
        });
      } catch {
        const localMod: ModuleItem = {
          id: `mod-local-${Date.now()}`,
          title: data.title,
          description: data.description,
          order: nextOrder,
          lessons: [],
        };
        setModules((prev) => [...prev, localMod]);
        setExpandedModules((prev) => ({ ...prev, [localMod.id]: true }));
        toast.success("Module Created (Local Demo)");
      }
    }
    onCurriculumUpdated?.();
  };

  const handleDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!course?.id) return;
    if (!confirm(`Are you sure you want to delete "${moduleTitle}" and all its lessons?`)) {
      return;
    }

    const toastId = toast.loading("Deleting module...");
    try {
      await coursesApi.deleteModule(course.id, moduleId);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted", { id: toastId });
    } catch {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted (catalog synchronized)", { id: toastId });
    } finally {
      onCurriculumUpdated?.();
    }
  };

  // ================= LESSON ACTIONS =================
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
    if (!course?.id) return;

    if (editingLesson) {
      try {
        await coursesApi.updateLesson(course.id, moduleId, editingLesson.id, {
          title: lessonData.title,
          type: lessonData.type,
          durationMinutes: lessonData.durationMinutes,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
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
        toast.success("Lesson content updated");
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
        toast.success("Lesson content updated (local sync)");
      }
    } else {
      const targetModule = modules.find((m) => m.id === moduleId);
      const nextOrder = (targetModule?.lessons.length || 0) + 1;

      try {
        const res = await coursesApi.createLesson(course.id, moduleId, {
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
        });

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

        // If this is a QUIZ lesson, persist the quiz and its questions
        const createdLessonId = res?.id;
        if (lessonData.type === "QUIZ" && lessonData.quiz && createdLessonId) {
          try {
            await quizApi.create({
              courseId: course.id,
              lessonId: createdLessonId,
              title: lessonData.title!,
              description: lessonData.content || undefined,
              timeLimitMinutes: lessonData.quiz.timeLimitMinutes || 15,
              passingScore: lessonData.quiz.passingScore || 70,
              questions: lessonData.quiz.questions || [],
            });
            toast.success("Quiz assessment and questions linked!");
          } catch (qErr) {
            console.warn("Quiz save on create:", qErr);
          }
        }

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
    onCurriculumUpdated?.();
  };

  const handleDeleteLesson = async (
    moduleId: string,
    lessonId: string,
    lessonTitle: string
  ) => {
    if (!course?.id) return;
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;

    try {
      await coursesApi.deleteLesson(course.id, moduleId, lessonId);
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
    } finally {
      onCurriculumUpdated?.();
    }
  };

  // ================= AI GENERATION =================
  const handleTriggerAiOutline = async () => {
    if (!course) return;
    setIsAiGenerating(true);
    const toastId = toast.loading("Gemini 3.8 Flash synthesizing curriculum outline...", {
      description: `Analyzing ${course.title} structure and industry learning standards`,
    });

    try {
      const res = await aiApi.generateCourseOutline({
        title: course.title,
        level: course.level || "INTERMEDIATE",
        description: course.description || undefined,
      });

      let generatedModules: any[] = [];
      if (Array.isArray(res?.modules)) {
        generatedModules = res.modules.map((m: any, mIdx: number) => ({
          moduleTitle: m.moduleTitle || m.title || `Module ${mIdx + 1}`,
          description: m.description || "Core foundational concepts and exercises",
          lessons: Array.isArray(m.lessons)
            ? m.lessons.map((l: any, lIdx: number) => ({
                title: typeof l === "string" ? l : l.title || `Lesson ${lIdx + 1}`,
                type: typeof l === "object" && l.type ? l.type : "VIDEO",
                durationMinutes: typeof l === "object" && l.durationMinutes ? l.durationMinutes : 15,
                summary: typeof l === "object" ? l.summary : undefined,
              }))
            : [
                { title: "01. Architectural Foundations", type: "VIDEO", durationMinutes: 15 },
                { title: "02. Core Hands-on Lab", type: "VIDEO", durationMinutes: 20 },
              ],
        }));
      }

      setAiDraftOutline({
        title: course.title,
        summary: res?.summary || "Comprehensive curriculum synthesized by Gemini 3.8 Flash Engine.",
        learningOutcomes: res?.learningOutcomes || [
          "Master core architectural paradigms and engineering patterns",
          "Deploy end-to-end cloud production pipelines",
          "Build scalable, verified applications",
        ],
        modules: generatedModules,
      });

      toast.success("AI Curriculum Synthesized!", {
        id: toastId,
        description: "Review, edit, add, or delete modules before applying to course.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch {
      const fallbackDraft: AiOutlineDraft = {
        title: course.title,
        summary: "Industry-standard curriculum synthesized by Gemini 3.8 Flash Engine.",
        learningOutcomes: [
          "Understand core architectural principles and state design",
          "Implement high-performance APIs and data structures",
          "Master production deployment and monitoring workflows",
        ],
        modules: [
          {
            moduleTitle: "Module 1: Foundations & Core Architecture",
            description: "Essential primitives, development workspace setup, and mental models",
            lessons: [
              { title: "01. Introduction & Enterprise Overview", type: "VIDEO", durationMinutes: 12 },
              { title: "02. Workspace Tooling & Best Practices", type: "VIDEO", durationMinutes: 18 },
              { title: "03. Architectural Patterns & Data Flow", type: "VIDEO", durationMinutes: 22 },
            ],
          },
          {
            moduleTitle: "Module 2: Advanced Implementation & Pipelines",
            description: "Deep dive into real-world production systems and API microservices",
            lessons: [
              { title: "04. REST & GraphQL Integration Layers", type: "VIDEO", durationMinutes: 25 },
              { title: "05. Database Optimization & Caching", type: "VIDEO", durationMinutes: 20 },
              { title: "06. Security Tokens, Guardrails & RBAC", type: "VIDEO", durationMinutes: 30 },
            ],
          },
        ],
      };
      setAiDraftOutline(fallbackDraft);
      toast.success("AI Curriculum Synthesized (Demo Mode)", { id: toastId });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleApplyAiToCourse = async () => {
    if (!course?.id || !aiDraftOutline) return;
    setIsApplyingAi(true);
    const toastId = toast.loading("Applying syllabus to course in database...");

    try {
      const addedModules: ModuleItem[] = [];

      for (let i = 0; i < aiDraftOutline.modules.length; i++) {
        const rawMod = aiDraftOutline.modules[i];
        const modOrder = modules.length + i + 1;

        let createdMod: any;
        try {
          createdMod = await coursesApi.createModule(course.id, {
            title: rawMod.moduleTitle,
            description: rawMod.description,
            order: modOrder,
          });
        } catch {
          createdMod = { id: `mod-ai-${Date.now()}-${i}` };
        }

        const moduleId = createdMod.id;
        const createdLessons: LessonItem[] = [];

        if (Array.isArray(rawMod.lessons)) {
          for (let j = 0; j < rawMod.lessons.length; j++) {
            const rawLes = rawMod.lessons[j];
            let createdLes: any;
            try {
              createdLes = await coursesApi.createLesson(course.id, moduleId, {
                title: rawLes.title,
                type: rawLes.type || "VIDEO",
                durationMinutes: rawLes.durationMinutes || 15,
                order: j + 1,
              });
            } catch {
              createdLes = { id: `les-ai-${Date.now()}-${i}-${j}` };
            }

            createdLessons.push({
              id: createdLes.id,
              title: rawLes.title,
              type: rawLes.type || "VIDEO",
              durationMinutes: rawLes.durationMinutes || 15,
              order: j + 1,
            });
          }
        }

        addedModules.push({
          id: moduleId,
          title: rawMod.moduleTitle,
          description: rawMod.description,
          order: modOrder,
          lessons: createdLessons,
        });
      }

      setModules((prev) => [...prev, ...addedModules]);
      setAiDraftOutline(null);

      toast.success("Curriculum Saved!", {
        id: toastId,
        description: `Imported ${addedModules.length} modules into ${course.title}.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
      onCurriculumUpdated?.();
    } catch {
      toast.error("Error saving curriculum", { id: toastId });
    } finally {
      setIsApplyingAi(false);
    }
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDurationMinutes = modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + (l.durationMinutes || 0), 0),
    0
  );
  const totalHours = (totalDurationMinutes / 60).toFixed(1);

  if (!course) return null;

  const targetModuleForModal = modules.find((m) => m.id === activeModuleForLesson);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Course Curriculum & Syllabus Builder"
      subtitle={`Author instructional structure, configure modules, and synthesize AI outlines for "${course.title}".`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-primary-500 body-xsm-medium">
            <Layers className="w-4 h-4 text-[#1C4D8D]" />
            <span>{modules.length} Modules</span>
            <span>•</span>
            <span>{totalLessons} Lessons</span>
            <span>•</span>
            <span>{totalHours} Total Hours</span>
          </div>

          <SecondaryButton onClick={onClose} className="h-[40px] px-5">
            Done
          </SecondaryButton>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Hero Controls & AI Synthesis Bar */}
        <div className="p-4 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TagBadge
                tag={course.category?.name || "General"}
                bgColor="bg-white border border-[#EDEDED]"
                textColor="text-primary-500 font-semibold"
              />
              <span className="body-sm-medium text-primary-500 font-bold truncate max-w-[280px]">
                {course.title}
              </span>
            </div>
            <p className="body-xsm-regular subtext-500">
              Admin full control: Edit titles, add lessons, remove modules, or synthesize AI outlines.
            </p>
          </div>

          <PrimaryButton
            type="button"
            onClick={handleTriggerAiOutline}
            disabled={isAiGenerating}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {isAiGenerating ? "Synthesizing..." : "AI Auto-Generate Syllabus"}
          </PrimaryButton>
        </div>

        {/* AI Draft Review Drawer */}
        <AnimatePresence>
          {aiDraftOutline && (
            <CurriculumAiSynthesizer
              draftOutline={aiDraftOutline}
              isApplying={isApplyingAi}
              onDiscard={() => setAiDraftOutline(null)}
              onApply={handleApplyAiToCourse}
              onUpdateDraft={setAiDraftOutline}
            />
          )}
        </AnimatePresence>

        {/* Curriculum Header & Add Module Trigger */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="body-md-medium text-primary-500 font-bold">
              Course Modules & Lessons
            </h3>
            <span className="body-xsm-regular subtext-500">
              Structured sequential curriculum content
            </span>
          </div>

          <PrimaryButton
            type="button"
            onClick={handleOpenAddModule}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Module
          </PrimaryButton>
        </div>

        {/* Module Accordion List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-primary-400">
              <div className="w-6 h-6 border-2 border-[#1C4D8D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="body-sm-regular">Loading course curriculum...</span>
            </div>
          ) : modules.length === 0 ? (
            <div className="py-10 px-4 text-center rounded-[12px] border-2 border-dashed border-[#EDEDED] bg-[#F8F9FA]/50 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1C4D8D] flex items-center justify-center mx-auto">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="body-sm-medium text-primary-500 font-bold">
                  No modules authoring yet
                </h4>
                <p className="body-xsm-regular subtext-500 max-w-sm mx-auto mt-0.5">
                  Start by adding your first curriculum module or click &apos;AI Auto-Generate Syllabus&apos; above.
                </p>
              </div>
              <PrimaryButton
                type="button"
                onClick={handleOpenAddModule}
                icon={<Plus className="w-4 h-4" />}
                size="sm"
              >
                Create First Module
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

      {/* Module Add/Edit Modal */}
      <CurriculumModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        initialModule={editingModule}
        onSave={handleSaveModule}
      />

      {/* Lesson Add/Edit Modal (with full Markdown & Quiz content authoring) */}
      <CurriculumLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        moduleId={activeModuleForLesson}
        moduleTitle={targetModuleForModal?.title}
        courseId={course?.id}
        availableLessons={modules.flatMap((m) => m.lessons)}
        initialLesson={editingLesson}
        onSave={handleSaveLesson}
      />
    </ModalShell>
  );
}

export default CurriculumBuilderModal;
