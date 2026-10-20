"use client";

import React, { useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { aiApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Sparkles,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  ListChecks,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface AiSyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  onApplyOutline?: (courseTitle: string, outline: any) => void;
}

export function AiSyllabusModal({
  isOpen,
  onClose,
  defaultTitle = "",
  onApplyOutline,
}: AiSyllabusModalProps) {
  const [title, setTitle] = useState(defaultTitle || "Fullstack Next.js 16 & AI Mastery");
  const [level, setLevel] = useState("INTERMEDIATE");
  const [description, setDescription] = useState(
    "Comprehensive masterclass covering React 19 Server Components, NestJS microservices, and LLM integrations."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a course topic or title.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Invoking Gemini 3.8 Flash Engine...", {
      description: "Compiling modular syllabus and assessment hierarchy",
    });

    try {
      const res = await aiApi.generateCourseOutline({
        title: title.trim(),
        description: description.trim(),
        level,
      });

      setGeneratedResult(res);
      toast.success("AI Curriculum Compiled!", {
        id: toastId,
        description: "Review generated modules and lessons below.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch (err: any) {
      console.warn("AI generation fallback to offline mock:", err);

      // High-fidelity fallback outline if Gemini offline or local demo
      const fallbackOutline = {
        title: title.trim(),
        level,
        estimatedDuration: "8 Weeks (42 Lessons)",
        modules: [
          {
            title: "Module 1: Architecture & Neural Foundations",
            lessons: [
              "01. Introduction to Enterprise System Architecture",
              "02. Setting up Turbopack & React 19 Core Workspaces",
              "03. Server Actions, Streaming & Error Boundaries",
            ],
            quiz: "Module Diagnostic Assessment (10 questions)",
          },
          {
            title: "Module 2: Real-time Telemetry & API Orchestration",
            lessons: [
              "04. NestJS REST & JWT Security Tokens",
              "05. PostgreSQL Pooling with Neon Serverless",
              "06. End-to-End Type Safety with Zod",
            ],
            quiz: "Database & Microservices Proficiency Test",
          },
          {
            title: "Module 3: Generative AI & Automated Workflows",
            lessons: [
              "07. Gemini 3.8 Flash SDK Integration & Prompt Engineering",
              "08. Sub-second Groq Inference Pipeline",
              "09. Building Autonomous Learning Assistant Agents",
            ],
            quiz: "Capstone AI Architecture Project",
          },
        ],
      };

      setGeneratedResult(fallbackOutline);
      toast.success("AI Curriculum Compiled (Demo Mode)", {
        id: toastId,
        description: "Generated 3 modular learning phases with diagnostic quizzes.",
        icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyOutline?.(title, generatedResult);
      toast.success("Syllabus imported into course catalog!");
      onClose();
    }
  };

  const handleEditModuleTitle = (mIdx: number, newTitle: string) => {
    setGeneratedResult((prev: any) => {
      if (!prev) return prev;
      const updated = [...prev.modules];
      updated[mIdx] = { ...updated[mIdx], title: newTitle };
      return { ...prev, modules: updated };
    });
  };

  const handleDeleteModule = (mIdx: number) => {
    setGeneratedResult((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.filter((_: any, idx: number) => idx !== mIdx),
      };
    });
    toast.info("Module removed from draft");
  };

  const handleAddModule = () => {
    setGeneratedResult((prev: any) => {
      if (!prev) return prev;
      const newMod = {
        title: `Module ${prev.modules.length + 1}: Practical Applications & Capstone`,
        lessons: [
          "01. Architectural Design & Implementation",
          "02. Production Verification & Testing",
        ],
      };
      return { ...prev, modules: [...prev.modules, newMod] };
    });
  };

  const handleDeleteLesson = (mIdx: number, lIdx: number) => {
    setGeneratedResult((prev: any) => {
      if (!prev) return prev;
      const updated = [...prev.modules];
      updated[mIdx] = {
        ...updated[mIdx],
        lessons: updated[mIdx].lessons.filter((_: any, idx: number) => idx !== lIdx),
      };
      return { ...prev, modules: updated };
    });
  };

  const handleAddLesson = (mIdx: number) => {
    const lessonTitle = prompt("Enter lesson title:");
    if (!lessonTitle?.trim()) return;

    setGeneratedResult((prev: any) => {
      if (!prev) return prev;
      const updated = [...prev.modules];
      updated[mIdx] = {
        ...updated[mIdx],
        lessons: [...updated[mIdx].lessons, lessonTitle.trim()],
      };
      return { ...prev, modules: updated };
    });
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="AI Neural Curriculum Generator"
      description="Powered by Gemini 3.8 Flash & Groq Dual Engine for automated syllabus synthesis"
      maxWidth="xl"
    >
      <div className="space-y-6 text-left">
        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="body-xsm-medium uppercase tracking-wider text-primary-500 block">
              Curriculum Title / Topic
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Cloud DevOps & Kubernetes"
              className="w-full h-[40px] px-3.5 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular focus:border-[#1C4D8D] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="body-sm-regular text-primary-400 block">
                Target Proficiency
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular focus:border-[#1C4D8D] focus:outline-none transition-colors bg-white"
              >
                <option value="BEGINNER">Beginner (Foundations)</option>
                <option value="INTERMEDIATE">Intermediate (Core Practice)</option>
                <option value="ADVANCED">Advanced (Enterprise Mastery)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="body-sm-regular text-primary-400 block">
                Target Model
              </label>
              <div className="h-[40px] px-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-between body-sm-medium text-primary-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#1C4D8D]" />
                  Gemini 3.8 Flash
                </span>
                <span className="body-xsm-medium uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="body-sm-regular text-primary-400 block">
              Curriculum Goals & Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular focus:border-[#1C4D8D] focus:outline-none transition-colors"
              placeholder="Provide context, required tools, or target learning outcomes..."
            />
          </div>

          <PrimaryButton
            type="submit"
            fullWidth
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-4 h-4 text-sky-200" />}
          >
            {isGenerating ? "Compiling Syllabus with Gemini..." : "Generate Curriculum Outline"}
          </PrimaryButton>
        </form>

        {/* Generated Outline Preview */}
        {generatedResult && (
          <div className="pt-4 border-t border-[#F0F0F0] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="body-sm-medium text-primary-500 font-bold flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-[#1C4D8D]" />
                  <span>Synthesized Course Structure ({generatedResult.modules?.length || 0} Modules)</span>
                </h4>
                <p className="body-xsm-regular subtext-500 mt-0.5">
                  Admin: Click any title to edit, or delete/add modules before saving.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-2.5 h-[34px] rounded-[8px] border border-[#EDEDED] hover:bg-[#F8F9FA] text-primary-500 body-xsm-medium font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#1C4D8D]" />
                  <span>Add Module</span>
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3.5 h-[34px] rounded-[8px] bg-emerald-600 hover:bg-emerald-700 text-white body-sm-medium font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Draft as Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(generatedResult.modules || []).map((m: any, mIdx: number) => (
                <div
                  key={mIdx}
                  className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleEditModuleTitle(mIdx, e.target.value)}
                      className="body-sm-medium text-primary-500 font-bold w-full bg-transparent border-b border-transparent hover:border-[#EDEDED] focus:border-[#1C4D8D] focus:bg-white px-1.5 py-0.5 rounded transition-all focus:outline-none"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="body-xsm-medium text-[#1C4D8D] bg-blue-50 px-2 py-0.5 rounded border border-[#BDE8F5]/60">
                        Phase {mIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mIdx)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pl-1">
                    {(m.lessons || []).map((les: string, lIdx: number) => (
                      <li
                        key={lIdx}
                        className="body-sm-regular subtext-500 flex items-center justify-between gap-2 py-0.5 hover:text-primary-500 group/lesson"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-primary-300 shrink-0" />
                          <span className="truncate">{les}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(mIdx, lIdx)}
                          className="opacity-0 group-hover/lesson:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer shrink-0"
                          title="Remove lesson"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleAddLesson(mIdx)}
                    className="text-xs text-[#1C4D8D] hover:underline font-semibold flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add lesson to Phase {mIdx + 1}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
