"use client";

import React, { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MessageSquareText } from "lucide-react";
import type { TemplateTrigger } from "@/types/notification";
import { TRIGGER_PLACEHOLDERS, type TemplateEditorValues } from "@/validations/notificationSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { PlaceholderChips } from "./PlaceholderChips";

type TextField = "subject" | "body";
const MAX: Record<TextField, number> = { subject: 120, body: 1500 };

/** Subject + body with placeholder chips that insert at the caret. */
export function TemplateMessageCard({ trigger }: { trigger: TemplateTrigger }) {
  const { register, control, setValue, getValues, formState } = useFormContext<TemplateEditorValues>();
  const subject = useWatch({ control, name: "subject" }) ?? "";
  const body = useWatch({ control, name: "body" }) ?? "";
  const refs = useRef<Record<TextField, HTMLInputElement | HTMLTextAreaElement | null>>({ subject: null, body: null });
  const placeholders = TRIGGER_PLACEHOLDERS[trigger];

  const insert = (field: TextField, token: string) => {
    const el = refs.current[field];
    const current = getValues(field) ?? "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);
    setValue(field, next, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const subjectReg = register("subject");
  const bodyReg = register("body");

  return (
    <IconSectionCard icon={<MessageSquareText className="h-5 w-5" />} tone="orange" title="Message" description="Use placeholders — they're replaced with real values for each student.">
      <div className="space-y-5">
        <div className="space-y-2">
          <InputField
            id="template-subject"
            label="Subject / Title"
            required
            maxLength={MAX.subject}
            placeholder="e.g. Welcome to {course_title}!"
            error={formState.errors.subject?.message}
            {...subjectReg}
            ref={(el) => {
              subjectReg.ref(el);
              refs.current.subject = el;
            }}
          />
          <div className="flex items-start justify-between gap-3">
            <PlaceholderChips placeholders={placeholders} onInsert={(p) => insert("subject", p)} />
            <CharCounter count={subject.length} max={MAX.subject} className="shrink-0" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="template-body" className="block body-sm-regular text-primary-400">
            Body<span className="ml-0.5 text-red">*</span>
          </label>
          <TextAreaField
            id="template-body"
            rows={8}
            maxLength={MAX.body}
            placeholder="Write the message students receive..."
            error={formState.errors.body?.message}
            {...bodyReg}
            ref={(el) => {
              bodyReg.ref(el);
              refs.current.body = el;
            }}
          />
          <div className="flex items-start justify-between gap-3">
            <PlaceholderChips placeholders={placeholders} onInsert={(p) => insert("body", p)} />
            <CharCounter count={body.length} max={MAX.body} className="shrink-0" />
          </div>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default TemplateMessageCard;
