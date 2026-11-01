"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { PenTool, Plus } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { SignerRow } from "./SignerRow";
import { MAX_SIGNERS, newSignerId } from "./designerUtils";

export interface SignaturesCardProps {
  /** Session-only local previews by signer id. */
  previews: Record<string, string>;
  onPreviewChange: (signerId: string, url: string | null) => void;
  onUploadingChange: (uploading: boolean) => void;
}

/** 1–3 signers (useFieldArray) with add / remove / reorder. */
export function SignaturesCard({ previews, onPreviewChange, onUploadingChange }: SignaturesCardProps) {
  const { control, formState } = useFormContext<TemplateFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "signers", keyName: "_key" });
  const arrayError = formState.errors.signers?.root?.message ?? formState.errors.signers?.message;

  return (
    <IconSectionCard
      icon={<PenTool className="h-5 w-5" />}
      title="Signatures"
      description={`Up to ${MAX_SIGNERS} people sign each certificate.`}
      tone="purple"
      action={
        <SecondaryButton
          type="button"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          disabled={fields.length >= MAX_SIGNERS}
          onClick={() => append({ id: newSignerId(), name: "", title: "", signatureUrl: "" }, { focusName: `signers.${fields.length}.name` })}
        >
          Add Signer
        </SecondaryButton>
      }
    >
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {fields.map((f, index) => (
            <motion.div
              key={f._key}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SignerRow
                index={index}
                count={fields.length}
                signerId={f.id}
                preview={previews[f.id]}
                onPreviewChange={(url) => onPreviewChange(f.id, url)}
                onUploadingChange={onUploadingChange}
                onMove={(from, to) => move(from, to)}
                onRemove={() => {
                  onPreviewChange(f.id, null);
                  remove(index);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <FieldError message={arrayError} />
        {fields.length >= MAX_SIGNERS && <p className="body-xsm-regular text-primary-300">You have reached the maximum of {MAX_SIGNERS} signers.</p>}
      </div>
    </IconSectionCard>
  );
}

export default SignaturesCard;
