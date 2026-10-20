"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AiOutlineDraft } from "./types";

interface CurriculumAiSynthesizerProps {
  draftOutline: AiOutlineDraft | null;
  isApplying: boolean;
  onDiscard: () => void;
  onApply: () => Promise<void>;
  onUpdateDraft: (updated: AiOutlineDraft) => void;
}

export function CurriculumAiSynthesizer({
  draftOutline,
  isApplying,
  onDiscard,
  onApply,
  onUpdateDraft,
}: CurriculumAiSynthesizerProps) {
  if (!draftOutline) return null;

  const handleModuleTitleChange = (modIdx: number, newTitle: string) => {
    const updated = { ...draftOutline };
    updated.modules[modIdx].moduleTitle = newTitle;
    onUpdateDraft(updated);
  };

  const handleLessonTitleChange = (
    modIdx: number,
    lesIdx: number,
    newTitle: string
  ) => {
    const updated = { ...draftOutline };
    updated.modules[modIdx].lessons[lesIdx].title = newTitle;
    onUpdateDraft(updated);
  };

  const handleDeleteModule = (modIdx: number) => {
    const updated = { ...draftOutline };
    updated.modules = updated.modules.filter((_, i) => i !== modIdx);
    onUpdateDraft(updated);
  };

  const handleDeleteLesson = (modIdx: number, lesIdx: number) => {
    const updated = { ...draftOutline };
    updated.modules[modIdx].lessons = updated.modules[modIdx].lessons.filter(
      (_, i) => i !== lesIdx
    );
    onUpdateDraft(updated);
  };

  const handleAddModule = () => {
    const updated = { ...draftOutline };
    updated.modules.push({
      moduleTitle: `Module ${updated.modules.length + 1}: Custom Topics`,
      description: "Added by curriculum administrator",
      lessons: [
        {
          title: "01. Introduction to Topic",
          type: "VIDEO",
          durationMinutes: 15,
        },
      ],
    });
    onUpdateDraft(updated);
  };

  const handleAddLesson = (modIdx: number) => {
    const updated = { ...draftOutline };
    const nextOrder = updated.modules[modIdx].lessons.length + 1;
    updated.modules[modIdx].lessons.push({
      title: `0${nextOrder}. New Lesson Topic`,
      type: "VIDEO",
      durationMinutes: 15,
    });
    onUpdateDraft(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 rounded-[12px] bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-[#1C4D8D]/30 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1C4D8D] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="body-sm-medium text-[#0F2854] font-bold">
              Gemini 3.8 Flash Draft Outline
            </h4>
            <p className="body-xsm-regular text-primary-400">
              You can edit, add, or delete any draft items before applying them to your catalog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SecondaryButton
            type="button"
            onClick={onDiscard}
            className="h-[32px] px-3 text-xs"
          >
            Discard
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={onApply}
            isLoading={isApplying}
            className="h-[32px] px-3.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
          >
            Apply All to Course
          </PrimaryButton>
        </div>
      </div>

      {/* Editable AI Draft Modules */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {draftOutline.modules.map((mod, mIdx) => (
          <div
            key={mIdx}
            className="p-3 rounded-[8px] bg-white border border-[#EDEDED] space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={mod.moduleTitle}
                onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                className="body-sm-medium text-[#0F2854] font-bold flex-1 px-2 py-1 rounded bg-[#F8F9FA] border border-transparent focus:border-[#1C4D8D] focus:bg-white outline-none transition-all"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAddLesson(mIdx)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-[#1C4D8D] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteModule(mIdx)}
                  className="p-1 text-primary-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Module"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Draft Lessons */}
            <div className="space-y-1.5 pl-2 border-l-2 border-blue-100">
              {mod.lessons.map((les, lIdx) => (
                <div
                  key={lIdx}
                  className="flex items-center justify-between gap-2 group"
                >
                  <input
                    type="text"
                    value={les.title}
                    onChange={(e) =>
                      handleLessonTitleChange(mIdx, lIdx, e.target.value)
                    }
                    className="body-xsm-regular text-primary-500 flex-1 px-2 py-0.5 rounded bg-transparent hover:bg-[#F8F9FA] focus:bg-white focus:border-[#EDEDED] border border-transparent outline-none"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-primary-400">
                      {les.durationMinutes}m
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(mIdx, lIdx)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-primary-300 hover:text-rose-500 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddModule}
        className="w-full py-2 border border-dashed border-[#1C4D8D]/40 rounded-[8px] text-xs font-semibold text-[#1C4D8D] bg-white/60 hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Another Module to Draft</span>
      </button>
    </motion.div>
  );
}
