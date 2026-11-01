"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Globe, Loader2, XCircle } from "lucide-react";
import { SAAS_ROOT_DOMAIN } from "@/types/saas";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { SignupDraft } from "./signupSteps";
import type { SlugCheck } from "./useSlugAvailability";

export interface SlugAvailabilityFieldProps {
  onTouched: () => void;
  check: SlugCheck;
}

/** Subdomain input with a fixed ".edupro.com" suffix, live availability badge and URL preview. */
export function SlugAvailabilityField({ onTouched, check }: SlugAvailabilityFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupDraft>();
  const field = register("slug", {
    setValueAs: (v: string) => v.toLowerCase().replace(/\s+/g, "-"),
  });
  const error = errors.slug?.message ?? (check.state === "taken" ? check.reason ?? "This subdomain is already taken — try another" : undefined);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor="signup-slug" className="body-sm-regular text-primary-400">
          Web address<span className="ml-0.5 text-red">*</span>
        </label>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={check.state} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.15 }}>
            {check.state === "checking" && (
              <ToneBadge tone="gray" size="sm" variant="pill" icon={<Loader2 className="h-3 w-3 animate-spin" />}>
                Checking...
              </ToneBadge>
            )}
            {check.state === "available" && (
              <ToneBadge tone="green" size="sm" variant="pill" icon={<CheckCircle2 className="h-3 w-3" />}>
                Available
              </ToneBadge>
            )}
            {check.state === "taken" && (
              <ToneBadge tone="red" size="sm" variant="pill" icon={<XCircle className="h-3 w-3" />}>
                Taken
              </ToneBadge>
            )}
          </motion.span>
        </AnimatePresence>
      </div>
      <div
        className={cn(
          "flex h-10 items-stretch overflow-hidden rounded-lg border bg-white shadow-xs transition-colors focus-within:border-brand-orange",
          error ? "border-red bg-red-14" : "border-dash"
        )}
      >
        <span className="flex items-center pl-3 text-primary-300">
          <Globe className="h-4 w-4" />
        </span>
        <input
          id="signup-slug"
          autoComplete="off"
          spellCheck={false}
          placeholder="your-academy"
          aria-invalid={!!error}
          className="min-w-0 flex-1 bg-transparent px-2.5 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300"
          {...field}
          onChange={(e) => {
            onTouched();
            void field.onChange(e);
          }}
        />
        <span className="flex items-center border-l border-dash bg-gray-bg px-3 body-sm-medium text-primary-400">.{SAAS_ROOT_DOMAIN}</span>
      </div>
      {error ? (
        <p className="mt-1.5 body-xsm-regular text-red">{error}</p>
      ) : (
        <p className="mt-1.5 body-xsm-regular text-primary-300">
          Your academy will live at{" "}
          <span className="body-xsm-medium text-brand-orange">
            {check.slug || "your-academy"}.{SAAS_ROOT_DOMAIN}
          </span>
          . You can connect your own domain later on Pro.
        </p>
      )}
    </div>
  );
}

export default SlugAvailabilityField;
