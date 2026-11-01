"use client";

import React, { useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Type } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { PlaceholderChips } from "./PlaceholderChips";
import { BODY_MAX, HEADING_MAX, bodyTextIssue } from "./designerUtils";

type ToggleKey = "showLogo" | "showQr" | "showGrade";
const TOGGLES: { key: ToggleKey; title: string; description: string }[] = [
  { key: "showLogo", title: "Show logo", description: "Your academy logo at the top of the certificate." },
  { key: "showQr", title: "Show QR code", description: "Lets anyone verify the certificate online." },
  { key: "showGrade", title: "Show grade", description: "Print the learner's final grade (enables {grade})." },
];

/** Heading, body text with placeholder chips (insert at cursor) and the logo / QR / grade toggles. */
export function ContentCard() {
  const { register, control, setValue, getValues, trigger, formState } = useFormContext<TemplateFormValues>();
  const [heading, bodyText, showGrade] = useWatch({ control, name: ["heading", "bodyText", "showGrade"] });
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyField = register("bodyText");

  const body = bodyText ?? "";
  const touched = !!formState.touchedFields.bodyText || !!formState.dirtyFields.bodyText || formState.isSubmitted;
  const bodyError = formState.errors.bodyText?.message ?? (touched ? bodyTextIssue(body, !!showGrade) : undefined);

  const insert = (placeholder: string) => {
    const el = bodyRef.current;
    const current = getValues("bodyText") ?? "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const needsSpace = start > 0 && !/\s$/.test(current.slice(0, start));
    const token = `${needsSpace ? " " : ""}${placeholder}`;
    const next = current.slice(0, start) + token + current.slice(end);
    setValue("bodyText", next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    requestAnimationFrame(() => {
      if (!el) return;
      const caret = start + token.length;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <IconSectionCard icon={<Type className="h-5 w-5" />} title="Content" description="The words printed on every certificate." tone="green">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="cert-heading" label="Heading" required count={(heading ?? "").length} max={HEADING_MAX} />
          <InputField
            id="cert-heading"
            placeholder="e.g. Certificate of Completion"
            maxLength={HEADING_MAX + 20}
            aria-invalid={!!formState.errors.heading}
            error={formState.errors.heading?.message}
            {...register("heading")}
          />
        </div>

        <div>
          <FieldLabel htmlFor="cert-body" label="Body Text" required count={body.length} max={BODY_MAX} />
          <TextAreaField
            id="cert-body"
            rows={4}
            placeholder="This is to certify that {student_name} has successfully completed {course_title}…"
            maxLength={BODY_MAX + 50}
            className={bodyError ? "border-red bg-red-14" : undefined}
            {...bodyField}
            ref={(el) => {
              bodyField.ref(el);
              bodyRef.current = el;
            }}
          />
          <FieldError message={bodyError} />
          <PlaceholderChips text={body} onInsert={insert} />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-dash pt-4 md:grid-cols-3">
          {TOGGLES.map((row) => (
            <Controller
              key={row.key}
              control={control}
              name={row.key}
              render={({ field }) => (
                <SettingToggleRow
                  id={`cert-${row.key}`}
                  title={row.title}
                  description={row.description}
                  checked={field.value}
                  onChange={(checked) => {
                    field.onChange(checked);
                    if (row.key === "showGrade" && touched) void trigger("bodyText");
                  }}
                />
              )}
            />
          ))}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default ContentCard;
