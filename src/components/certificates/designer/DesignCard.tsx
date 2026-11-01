"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Palette, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { CertificateLayout, CertificateOrientation } from "@/types/certificate";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { AccentSwatchPicker } from "./AccentSwatchPicker";
import { LayoutThumbnail } from "./LayoutThumbnail";
import { LAYOUT_OPTIONS, previewTemplate } from "./designerUtils";

const ORIENTATION_OPTIONS: ChoiceOption<CertificateOrientation>[] = [
  { value: "LANDSCAPE", title: "Landscape", description: "Wide, best for print & sharing", icon: <RectangleHorizontal className="h-5 w-5 text-primary-400" /> },
  { value: "PORTRAIT", title: "Portrait", description: "Tall, like a document", icon: <RectangleVertical className="h-5 w-5 text-primary-400" /> },
];

/** Layout (with live thumbnails), orientation and accent colour. */
export function DesignCard() {
  const { control } = useFormContext<TemplateFormValues>();
  const values = useWatch({ control }) as Partial<TemplateFormValues>;
  const base = previewTemplate(values);

  const layoutOptions: ChoiceOption<CertificateLayout>[] = LAYOUT_OPTIONS.map((o) => ({
    value: o.value,
    title: o.title,
    description: o.description,
    icon: <LayoutThumbnail layout={o.value} template={base} />,
  }));

  return (
    <IconSectionCard icon={<Palette className="h-5 w-5" />} title="Design" description="Choose the look of the certificate." tone="orange">
      <div className="space-y-5">
        <div>
          <FieldLabel label="Layout" required />
          <Controller
            control={control}
            name="layout"
            render={({ field }) => (
              <ChoiceCardGroup name="cert-layout" aria-label="Layout" value={field.value} onChange={field.onChange} options={layoutOptions} columns={3} iconPosition="top" />
            )}
          />
        </div>

        <div>
          <FieldLabel label="Orientation" required />
          <Controller
            control={control}
            name="orientation"
            render={({ field }) => (
              <ChoiceCardGroup name="cert-orientation" aria-label="Orientation" value={field.value} onChange={field.onChange} options={ORIENTATION_OPTIONS} columns={2} />
            )}
          />
        </div>

        <div>
          <FieldLabel label="Accent Colour" required />
          <Controller control={control} name="accent" render={({ field }) => <AccentSwatchPicker value={field.value} onChange={field.onChange} />} />
        </div>
      </div>
    </IconSectionCard>
  );
}

export default DesignCard;
