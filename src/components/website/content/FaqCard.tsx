"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, HelpCircle, Plus, Trash2 } from "lucide-react";
import { WEBSITE_LIMITS, type WebsiteFormValues } from "@/validations/websiteSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LengthField } from "./LengthField";

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:border-primary-300 hover:text-primary-500 disabled:opacity-40";

/** FAQ editor: add, reorder and remove questions (home and Contact pages; hidden while empty). */
export function FaqCard() {
  const { control, formState: { errors } } = useFormContext<WebsiteFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "faqs" });
  const full = fields.length >= WEBSITE_LIMITS.faqs;

  return (
    <SettingsCard
      icon={<HelpCircle className="h-5 w-5" />}
      title="FAQ"
      description="Questions answered on the home and Contact pages."
      tone="blue"
      action={
        <ToneBadge tone="gray" size="sm">
          {fields.length}/{WEBSITE_LIMITS.faqs}
        </ToneBadge>
      }
      divided={false}
    >
      <div className="space-y-3 p-5">
        <AnimatePresence initial={false}>
          {fields.map((f, i) => (
            <motion.div key={f.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-dash bg-slate-50/60 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="body-xsm-medium font-semibold text-primary-400">Question {i + 1}</span>
                <div className="flex gap-1.5">
                  <motion.button type="button" whileTap={{ scale: 0.92 }} className={iconBtn} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </motion.button>
                  <motion.button type="button" whileTap={{ scale: 0.92 }} className={iconBtn} disabled={i === fields.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </motion.button>
                  <motion.button type="button" whileTap={{ scale: 0.92 }} className={`${iconBtn} hover:border-red hover:text-red`} onClick={() => remove(i)} aria-label="Remove question">
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              <div className="space-y-3">
                <LengthField name={`faqs.${i}.question`} id={`web-faq-q-${i}`} max={WEBSITE_LIMITS.question} placeholder="How do I enrol in a course?" error={errors.faqs?.[i]?.question?.message} />
                <LengthField name={`faqs.${i}.answer`} id={`web-faq-a-${i}`} rows={3} max={WEBSITE_LIMITS.answer} placeholder="Open the course, click Enroll now…" error={errors.faqs?.[i]?.answer?.message} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {fields.length === 0 && <p className="rounded-xl border border-dashed border-dash p-5 text-center body-sm-regular text-primary-300">No questions yet — the FAQ section stays hidden until you add one.</p>}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={full}
          onClick={() => append({ question: "", answer: "" })}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-brand-orange/50 body-sm-medium text-brand-orange transition-colors hover:bg-brand-orange-light disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {full ? `Maximum ${WEBSITE_LIMITS.faqs} questions` : "Add question"}
        </motion.button>
      </div>
    </SettingsCard>
  );
}

export default FaqCard;
