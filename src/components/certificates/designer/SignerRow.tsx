"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { SignatureUpload } from "./SignatureUpload";

export interface SignerRowProps {
  index: number;
  count: number;
  signerId: string;
  preview?: string;
  onPreviewChange: (url: string | null) => void;
  onUploadingChange: (uploading: boolean) => void;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

function IconButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        danger
          ? "flex h-8 w-8 items-center justify-center rounded-lg border border-dash text-primary-300 hover:border-red hover:bg-red-14 hover:text-red disabled:opacity-40 disabled:pointer-events-none"
          : "flex h-8 w-8 items-center justify-center rounded-lg border border-dash text-primary-300 hover:bg-gray-bg hover:text-primary-500 disabled:opacity-40 disabled:pointer-events-none"
      }
    >
      {children}
    </motion.button>
  );
}

/** One signer: name, title, optional signature image, reorder + remove. */
export function SignerRow({ index, count, signerId, preview, onPreviewChange, onUploadingChange, onMove, onRemove }: SignerRowProps) {
  const { register, control, formState } = useFormContext<TemplateFormValues>();
  const errors = formState.errors.signers?.[index];

  return (
    <div className="rounded-xl border border-dash bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="body-sm-medium font-semibold! text-primary-500">Signer {index + 1}</p>
        <div className="flex items-center gap-1.5">
          <IconButton label="Move up" onClick={() => onMove(index, index - 1)} disabled={index === 0}>
            <ArrowUp className="h-4 w-4" />
          </IconButton>
          <IconButton label="Move down" onClick={() => onMove(index, index + 1)} disabled={index === count - 1}>
            <ArrowDown className="h-4 w-4" />
          </IconButton>
          <IconButton label="Remove signer" onClick={onRemove} disabled={count <= 1} danger>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`cert-signer-${index}-name`} label="Name" required />
          <InputField
            id={`cert-signer-${index}-name`}
            placeholder="e.g. Arif Hossain"
            aria-invalid={!!errors?.name}
            error={errors?.name?.message}
            {...register(`signers.${index}.name`)}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`cert-signer-${index}-title`} label="Title" required />
          <InputField
            id={`cert-signer-${index}-title`}
            placeholder="e.g. Lead Instructor"
            aria-invalid={!!errors?.title}
            error={errors?.title?.message}
            {...register(`signers.${index}.title`)}
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor={`cert-signer-${signerId}-image`} label="Signature Image" optional />
        <Controller
          control={control}
          name={`signers.${index}.signatureUrl`}
          render={({ field }) => (
            <SignatureUpload
              id={`cert-signer-${signerId}-image`}
              value={field.value}
              onChange={(url) => field.onChange(url)}
              preview={preview}
              onPreviewChange={onPreviewChange}
              onUploadingChange={onUploadingChange}
            />
          )}
        />
      </div>
    </div>
  );
}

export default SignerRow;
