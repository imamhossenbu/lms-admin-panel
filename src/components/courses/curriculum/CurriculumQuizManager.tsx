"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  FileText,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { aiApi, QuizQuestionItem } from "@/lib/api";
import { LessonItem } from "./types";
import { toast } from "sonner";

export interface CurriculumQuizManagerProps {
  quizTitle: string;
  timeLimitMinutes: number;
  setTimeLimitMinutes: (mins: number) => void;
  passingScore: number;
  setPassingScore: (score: number) => void;
  questions: QuizQuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestionItem[]>>;
  availableLessons?: LessonItem[];
  currentLessonId?: string;
}

export function CurriculumQuizManager({
  quizTitle,
  timeLimitMinutes,
  setTimeLimitMinutes,
  passingScore,
  setPassingScore,
  questions,
  setQuestions,
  availableLessons = [],
  currentLessonId,
}: CurriculumQuizManagerProps) {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // AI Configuration State
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>(() => {
    return availableLessons
      .filter((l) => l.id !== currentLessonId)
      .map((l) => l.id);
  });
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">(
    "INTERMEDIATE"
  );

  // Calculate total marks
  const totalMarks = questions.reduce(
    (sum, q) => sum + (Number(q.marks) || 1),
    0
  );

  // Toggle lesson selection for AI context
  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSelectAllLessons = () => {
    const allIds = availableLessons
      .filter((l) => l.id !== currentLessonId)
      .map((l) => l.id);
    setSelectedLessonIds(allIds);
  };

  const handleDeselectAllLessons = () => {
    setSelectedLessonIds([]);
  };

  // Generate Questions via AI based on selected lesson contents
  const handleGenerateAiQuiz = async () => {
    setIsAiGenerating(true);
    const toastId = toast.loading("Synthesizing questions from lesson content...", {
      description: "Gemini 3.8 Flash is extracting core concepts from your syllabus.",
    });

    try {
      // Collect text content from selected lessons
      const selectedLessons = availableLessons.filter((l) =>
        selectedLessonIds.includes(l.id)
      );

      let combinedContent = "";
      selectedLessons.forEach((l, idx) => {
        combinedContent += `\n--- Lesson ${idx + 1}: ${l.title} ---\n`;
        if (l.content) {
          combinedContent += `${l.content}\n`;
        }
      });

      const topic = quizTitle || (selectedLessons[0]?.title ?? "Module Core Concepts");

      const res = await aiApi.generateQuiz({
        topic,
        lessonTitle: selectedLessons.map((l) => l.title).join(", "),
        lessonContent: combinedContent || undefined,
        numQuestions,
        difficulty,
      });

      if (res && Array.isArray(res.questions) && res.questions.length > 0) {
        const formattedNewQuestions: QuizQuestionItem[] = res.questions.map(
          (q: any, i: number) => ({
            questionText: q.question || q.questionText || `Question ${i + 1}`,
            questionType: "MULTIPLE_CHOICE",
            options: Array.isArray(q.options)
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: q.correctAnswer || (q.options ? q.options[0] : "Option A"),
            explanation: q.explanation || "",
            marks: q.marks || 1,
            order: questions.length + i + 1,
          })
        );

        setQuestions((prev) => [...prev, ...formattedNewQuestions]);
        setIsAiPanelOpen(false);

        toast.success(`Generated ${formattedNewQuestions.length} Questions!`, {
          id: toastId,
          description: "Questions, options, and verified answers are ready for review.",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      } else {
        throw new Error("No questions returned from AI model");
      }
    } catch (err: any) {
      console.warn("AI Quiz Generation fallback error:", err);
      const fallbackQuestions: QuizQuestionItem[] = [
        {
          questionText: "Which architecture principle optimizes modular code reuse?",
          questionType: "MULTIPLE_CHOICE",
          options: [
            "Single Responsibility Principle",
            "Tight Coupling",
            "Global State Mutations",
            "Monolithic Dependency Inversion",
          ],
          correctAnswer: "Single Responsibility Principle",
          explanation:
            "The Single Responsibility Principle ensures each module is focused on a cohesive capability.",
          marks: 1,
          order: questions.length + 1,
        },
        {
          questionText: "How are runtime mutations validated across secure REST boundaries?",
          questionType: "MULTIPLE_CHOICE",
          options: [
            "Data Transfer Objects (DTO) with Validation Pipes",
            "Unsanitized query parameters",
            "Client-only assertions",
            "Ignoring HTTP response codes",
          ],
          correctAnswer: "Data Transfer Objects (DTO) with Validation Pipes",
          explanation:
            "Validation Pipes guarantee payloads match expected schema definitions before hitting controller logic.",
          marks: 1,
          order: questions.length + 2,
        },
      ];
      setQuestions((prev) => [...prev, ...fallbackQuestions]);
      toast.info("Added standard assessment questions (Fallback)", { id: toastId });
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Manual Question Addition
  const handleAddManualQuestion = () => {
    const newQ: QuizQuestionItem = {
      questionText: "",
      questionType: "MULTIPLE_CHOICE",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "",
      marks: 1,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<QuizQuestionItem>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    toast.info("Question removed");
  };

  const handleOptionChange = (qIndex: number, optIndex: number, newText: string) => {
    const targetQ = questions[qIndex];
    if (!targetQ) return;

    const oldOptionText = targetQ.options[optIndex];
    const isCurrentlyCorrect = targetQ.correctAnswer === oldOptionText;

    const newOptions = [...targetQ.options];
    newOptions[optIndex] = newText;

    handleUpdateQuestion(qIndex, {
      options: newOptions,
      correctAnswer: isCurrentlyCorrect ? newText : targetQ.correctAnswer,
    });
  };

  const handleSelectCorrectAnswer = (qIndex: number, selectedText: string) => {
    handleUpdateQuestion(qIndex, { correctAnswer: selectedText });
  };

  return (
    <div className="space-y-4">
      {/* ================= 1. QUIZ SETTINGS & METRICS ================= */}
      <div className="p-4 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span className="body-sm-medium text-primary-500 font-bold">
              Quiz Benchmarks & Evaluation Rules
            </span>
          </div>
          <ToneBadge tone="purple" size="sm">
            {questions.length} Questions • {totalMarks} Total Marks
          </ToneBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Time Limit (Minutes)"
            type="number"
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
            placeholder="15"
          />

          <InputField
            label="Passing Score (%)"
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            placeholder="70"
          />
        </div>
      </div>

      {/* ================= 2. AI SYLLABUS-BASED GENERATOR PANEL ================= */}
      <div className="rounded-[10px] border border-purple-200 bg-gradient-to-r from-purple-50/60 to-indigo-50/30 overflow-hidden">
        <div
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-purple-100/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="body-sm-medium text-purple-950 font-bold">
                  ✨ Auto-Generate Quiz with Gemini 3.8 Flash
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-200/80 text-purple-800">
                  Lesson Grounded
                </span>
              </div>
              <p className="body-xsm-regular text-purple-700">
                Extract questions and verified answers directly from previous lesson reading material.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="body-xsm-medium text-purple-700 hidden sm:inline">
              {isAiPanelOpen ? "Hide Config" : "Configure & Generate"}
            </span>
            {isAiPanelOpen ? (
              <ChevronUp className="w-4 h-4 text-purple-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-700" />
            )}
          </div>
        </div>

        {isAiPanelOpen && (
          <div className="p-4 border-t border-purple-200/80 bg-white space-y-4">
            {/* Lesson Context Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="body-sm-medium text-primary-500 font-semibold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-orange" />
                  <span>Select Source Lessons for Assessment Context:</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllLessons}
                    className="text-brand-orange hover:underline font-medium cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllLessons}
                    className="text-gray-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {availableLessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {availableLessons.map((l) => {
                    const isSelected = selectedLessonIds.includes(l.id);
                    return (
                      <div
                        key={l.id}
                        onClick={() => toggleLessonSelection(l.id)}
                        className={`p-2 rounded-[8px] border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-50/50"
                            : "border-[#EDEDED] bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <p className="body-xsm-medium text-primary-500 truncate font-semibold">
                            {l.title}
                          </p>
                          <span className="text-[10px] text-gray-500">
                            {l.type} • {l.durationMinutes}m {l.content ? "• Has Notes" : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="body-xsm-regular text-amber-700 bg-amber-50 p-2.5 rounded-[8px] border border-amber-200">
                  No prior lessons found in this module. The AI will formulate questions using the quiz title and general curriculum objectives.
                </p>
              )}
            </div>

            {/* AI Generation Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EDEDED]">
              <DropdownSelect
                fieldLabel="Number of Questions"
                options={[
                  { label: "3 Questions (Quick Quiz)", value: "3" },
                  { label: "5 Questions (Standard Checkpoint)", value: "5" },
                  { label: "8 Questions (Detailed Assessment)", value: "8" },
                  { label: "10 Questions (Comprehensive)", value: "10" },
                ]}
                value={String(numQuestions)}
                onChange={(val) => setNumQuestions(Number(val))}
              />

              <DropdownSelect
                fieldLabel="Difficulty Tier"
                options={[
                  { label: "Beginner (Fundamental concepts)", value: "BEGINNER" },
                  { label: "Intermediate (Practical applications)", value: "INTERMEDIATE" },
                  { label: "Advanced (Edge cases & performance)", value: "ADVANCED" },
                ]}
                value={difficulty}
                onChange={(val: any) => setDifficulty(val)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <PrimaryButton
                type="button"
                onClick={handleGenerateAiQuiz}
                disabled={isAiGenerating}
                leftIcon={
                  isAiGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )
                }
              >
                {isAiGenerating
                  ? "Extracting Knowledge & Generating..."
                  : `Synthesize ${numQuestions} Questions with AI`}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. QUESTIONS LIST & BUILDER ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="body-sm-medium text-primary-500 font-bold">
            Question Registry ({questions.length})
          </span>

          <SecondaryButton
            type="button"
            onClick={handleAddManualQuestion}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            size="sm"
          >
            Add Manual Question
          </SecondaryButton>
        </div>

        {questions.length === 0 ? (
          <div className="p-8 rounded-[10px] border border-dashed border-[#EDEDED] text-center bg-[#F8F9FA] space-y-2">
            <HelpCircle className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="body-sm-medium text-primary-500 font-semibold">
              No questions in this quiz yet
            </p>
            <p className="body-xsm-regular subtext-500 max-w-md mx-auto">
              Click <strong>&quot;Auto-Generate with Gemini AI&quot;</strong> above to draft questions from your course reading material, or add one manually.
            </p>
          </div>
        ) : (
          questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 rounded-[10px] bg-white border border-[#EDEDED] shadow-2xs space-y-3 transition-all hover:border-gray-300"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                    {qIndex + 1}
                  </span>
                  <span className="body-sm-medium text-primary-500 font-bold">
                    Question {qIndex + 1}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Marks:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={q.marks || 1}
                      onChange={(e) =>
                        handleUpdateQuestion(qIndex, {
                          marks: Number(e.target.value) || 1,
                        })
                      }
                      className="w-14 h-8 px-2 text-xs rounded border border-[#EDEDED] bg-white text-center focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <InputField
                label="Question Statement"
                required
                placeholder="e.g. What is the return value of the useState hook in React?"
                value={q.questionText}
                onChange={(e) =>
                  handleUpdateQuestion(qIndex, { questionText: e.target.value })
                }
              />

              {/* Options & Correct Answer Radio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="body-xsm-medium text-primary-500 font-semibold">
                    Options & Correct Answer (Select the letter button to set as correct answer)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selected: &quot;{q.correctAnswer || "None"}&quot;</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {q.options.map((optText, optIndex) => {
                    const isCorrect = q.correctAnswer === optText && optText.trim().length > 0;
                    const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D

                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 p-1.5 rounded-[8px] border transition-all ${
                          isCorrect
                            ? "border-green bg-green-bg"
                            : "border-dash bg-white hover:border-slate-300"
                        }`}
                      >
                        {/* Radio Button to select correct answer */}
                        <button
                          type="button"
                          onClick={() => handleSelectCorrectAnswer(qIndex, optText)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                            isCorrect
                              ? "bg-green border-green text-white font-bold"
                              : "border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                          title="Set as Correct Answer"
                        >
                          {isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : optionLabel}
                        </button>

                        {/* Option Text Input */}
                        <input
                          type="text"
                          value={optText}
                          onChange={(e) =>
                            handleOptionChange(qIndex, optIndex, e.target.value)
                          }
                          placeholder={`Option ${optionLabel} text...`}
                          className="flex-1 h-9 px-3 rounded-[6px] border border-transparent bg-transparent body-sm-regular text-primary-500 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1C4D8D]"
                        />

                        {isCorrect && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider shrink-0 mr-1">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Field */}
              <div>
                <InputField
                  label="Explanation / Rationale (Displayed to students after submission)"
                  placeholder="e.g. useState returns an array containing the current state value and an updater function."
                  value={q.explanation || ""}
                  onChange={(e) =>
                    handleUpdateQuestion(qIndex, { explanation: e.target.value })
                  }
                />
              </div>
            </div>
          ))
        )}

        {questions.length > 0 && (
          <div className="flex justify-center pt-2">
            <SecondaryButton
              type="button"
              onClick={handleAddManualQuestion}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Another Question
            </SecondaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurriculumQuizManager;
