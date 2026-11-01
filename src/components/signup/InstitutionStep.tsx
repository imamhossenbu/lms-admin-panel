"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Briefcase, Building2, GraduationCap, Landmark, MapPin, Sparkles } from "lucide-react";
import { INSTITUTION_TYPES, SAAS_COUNTRIES, type InstitutionType } from "@/types/saas";
import { normalizeSlug } from "@/validations/saasSchema";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { SlugAvailabilityField } from "./SlugAvailabilityField";
import type { SignupDraft } from "./signupSteps";
import type { SlugCheck } from "./useSlugAvailability";

const TYPE_META: Record<InstitutionType, { title: string; icon: React.ReactNode }> = {
  SCHOOL: { title: "School", icon: <Building2 className="h-4.5 w-4.5 text-brand-orange" /> },
  COACHING: { title: "Coaching centre", icon: <GraduationCap className="h-4.5 w-4.5 text-blue" /> },
  UNIVERSITY: { title: "University", icon: <Landmark className="h-4.5 w-4.5 text-purple" /> },
  COMPANY: { title: "Company", icon: <Briefcase className="h-4.5 w-4.5 text-green" /> },
  CREATOR: { title: "Creator", icon: <Sparkles className="h-4.5 w-4.5 text-yellow" /> },
};

const TYPE_OPTIONS: ChoiceOption<InstitutionType>[] = INSTITUTION_TYPES.map((t) => ({ value: t, ...TYPE_META[t] }));
const COUNTRY_OPTIONS = SAAS_COUNTRIES.map((c) => ({ value: c, label: c }));

export interface InstitutionStepProps {
  slugTouched: boolean;
  onSlugTouched: () => void;
  slugCheck: SlugCheck;
}

/** Step 2 — institution name, type, country and the `slug.edupro.com` address (auto-suggested). */
export function InstitutionStep({ slugTouched, onSlugTouched, slugCheck }: InstitutionStepProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<SignupDraft>();

  const nameField = register("institutionName");

  return (
    <div className="space-y-4">
      <InputField
        id="signup-institution"
        label="Institution name"
        required
        placeholder="e.g. Dhaka Coding Academy"
        leftElement={<Building2 className="h-4 w-4" />}
        error={errors.institutionName?.message}
        aria-invalid={!!errors.institutionName}
        {...nameField}
        onChange={(e) => {
          void nameField.onChange(e);
          if (!slugTouched) setValue("slug", normalizeSlug(e.target.value), { shouldValidate: e.target.value.length > 2 });
        }}
      />

      <div>
        <p className="mb-2 body-sm-regular text-primary-400">
          Type<span className="ml-0.5 text-red">*</span>
        </p>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <ChoiceCardGroup<InstitutionType>
              name="signup-type"
              aria-label="Institution type"
              value={field.value}
              onChange={field.onChange}
              options={TYPE_OPTIONS}
              columns={5}
              iconPosition="top"
            />
          )}
        />
        {errors.type && <p className="mt-1.5 body-xsm-regular text-red">{errors.type.message}</p>}
      </div>

      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <SelectField
            id="signup-country"
            label="Country"
            leftIcon={<MapPin />}
            options={COUNTRY_OPTIONS}
            value={field.value}
            onChange={(v) => field.onChange(v)}
            error={errors.country?.message}
          />
        )}
      />

      <SlugAvailabilityField onTouched={onSlugTouched} check={slugCheck} />
    </div>
  );
}

export default InstitutionStep;
