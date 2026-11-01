"use client";

import React, { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link2, Save } from "lucide-react";
import type { IntegrationSettings } from "@/validations/platformSettingsSchema";
import { SecretField } from "@/components/settings/shared/SecretField";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { cn } from "@/lib/cn";
import { INTEGRATION_TILE, type IntegrationMeta } from "./integrationsMeta";

export interface ConnectFormValues {
  accountLabel: string;
  apiKey: string;
  option: string;
}

export interface IntegrationConnectModalProps {
  isOpen: boolean;
  meta: IntegrationMeta;
  /** "connect": first-time setup. "manage": edit an existing connection. */
  mode: "connect" | "manage";
  current: IntegrationSettings;
  /** Masked stored key ("••••91be"), if any. */
  secretHint?: string;
  onClose: () => void;
  /** Resolve true to close the modal. */
  onSubmit: (values: ConnectFormValues) => Promise<boolean>;
}

function buildSchema(meta: IntegrationMeta, hasStoredKey: boolean) {
  return z
    .object({
      accountLabel: z.string().trim().min(2, `Enter the ${meta.accountLabel.toLowerCase()}`).max(80, "80 characters or less"),
      apiKey: z.string().trim(),
      option: z.string().trim(),
    })
    .superRefine((v, ctx) => {
      if (meta.requiresApiKey && !hasStoredKey && !v.apiKey)
        ctx.addIssue({
          code: "custom",
          path: ["apiKey"],
          message: `Paste the ${meta.apiKeyLabel.toLowerCase()}`,
        });
      const opt = meta.option;
      if (opt?.kind === "select" && !opt.choices?.some((c) => c.value === v.option))
        ctx.addIssue({
          code: "custom",
          path: ["option"],
          message: `Choose a ${opt.label.toLowerCase()}`,
        });
      if (opt?.kind === "text") {
        if (!v.option)
          ctx.addIssue({
            code: "custom",
            path: ["option"],
            message: `Enter the ${opt.label.toLowerCase()}`,
          });
        else if (opt.pattern && !opt.pattern.test(v.option))
          ctx.addIssue({
            code: "custom",
            path: ["option"],
            message: opt.patternMessage ?? "Invalid format",
          });
      }
    });
}

/** Small connect / manage form for one integration (own form; the section persists it on submit). */
export function IntegrationConnectModal({ isOpen, meta, mode, current, secretHint, onClose, onSubmit }: IntegrationConnectModalProps) {
  const schema = useMemo(() => buildSchema(meta, mode === "manage" && !!secretHint), [meta, mode, secretHint]);
  const defaults = useMemo<ConnectFormValues>(
    () => ({
      accountLabel: mode === "manage" ? current.accountLabel : "",
      apiKey: "",
      option: current.option || (meta.option?.kind === "select" ? (meta.option.choices?.[0]?.value ?? "") : ""),
    }),
    [current.accountLabel, current.option, meta.option, mode]
  );
  const form = useForm<ConnectFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: defaults,
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (isOpen) reset(defaults);
  }, [isOpen, defaults, reset]);

  const formId = `integration-${meta.key}-form`;
  const submit = handleSubmit(async (values) => {
    const ok = await onSubmit({
      ...values,
      option: meta.option?.kind === "text" ? values.option.toUpperCase() : values.option,
    });
    if (ok) onClose();
  });

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={mode === "connect" ? `Connect ${meta.name}` : `Manage ${meta.name}`}
      subtitle={meta.description}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} leftIcon={mode === "connect" ? <Link2 /> : <Save />}>
            {isSubmitting ? "Saving..." : mode === "connect" ? "Connect" : "Save changes"}
          </PrimaryButton>
        </>
      }
    >
      <FormProvider {...form}>
        <form
          id={formId}
          noValidate
          onSubmit={(e) => {
            // The modal is portaled but React events still bubble to the section form.
            e.stopPropagation();
            void submit(e);
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 rounded-xl border border-dash bg-slate-50 px-4 py-3">
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", INTEGRATION_TILE[meta.tone])}>{meta.icon}</span>
            <div className="min-w-0">
              <p className="body-sm-medium font-semibold! text-primary-500">{meta.name}</p>
              <p className="body-xsm-regular text-primary-300">{meta.category}</p>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={`${formId}-account`} label={meta.accountLabel} required />
            <InputField
              id={`${formId}-account`}
              placeholder={meta.accountPlaceholder}
              autoComplete="off"
              error={errors.accountLabel?.message}
              {...register("accountLabel")}
            />
          </div>

          <SecretField
            name="apiKey"
            label={meta.requiresApiKey ? meta.apiKeyLabel : `${meta.apiKeyLabel} (optional)`}
            hint={mode === "manage" ? secretHint : undefined}
            placeholder={mode === "manage" && secretHint ? undefined : "Paste the key"}
          />

          {meta.option?.kind === "select" && (
            <div>
              <FieldLabel label={meta.option.label} required />
              <Controller
                control={control}
                name="option"
                render={({ field }) => <AppSelect value={field.value} onValueChange={field.onChange} options={meta.option?.choices ?? []} fullWidth />}
              />
              {errors.option ? <FieldError message={errors.option.message} /> : <p className="mt-1.5 body-xsm-regular text-primary-300">{meta.option.helper}</p>}
            </div>
          )}

          {meta.option?.kind === "text" && (
            <div>
              <FieldLabel htmlFor={`${formId}-option`} label={meta.option.label} required />
              <InputField
                id={`${formId}-option`}
                placeholder={meta.option.placeholder}
                autoComplete="off"
                spellCheck={false}
                error={errors.option?.message}
                {...register("option")}
              />
              {!errors.option && meta.option.helper && <p className="mt-1.5 body-xsm-regular text-primary-300">{meta.option.helper}</p>}
            </div>
          )}
        </form>
      </FormProvider>
    </ModalShell>
  );
}

export default IntegrationConnectModal;
