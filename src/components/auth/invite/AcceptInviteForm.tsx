"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock, User } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { acceptInviteSchema, type AcceptInviteFormData } from "@/validations/authSchema";

export interface AcceptInviteFormProps {
  isSubmitting: boolean;
  onSubmit: (values: AcceptInviteFormData) => void;
}

/** Same rules the API enforces (8+ characters, a letter and a number). */
const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Include a letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "Include a number", test: (p: string) => /[0-9]/.test(p) },
];

/** Name + password to create the staff account behind an invitation. */
export function AcceptInviteForm({ isSubmitting, onSubmit }: AcceptInviteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({ resolver: zodResolver(acceptInviteSchema), mode: "onTouched", defaultValues: { name: "", password: "", confirmPassword: "" } });
  const password = useWatch({ control, name: "password" }) ?? "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left" noValidate>
      <AuthField id="invite-name" label="Full name" icon={User} placeholder="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <AuthField id="invite-password" label="Create a password" icon={Lock} revealable placeholder="••••••••" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <ul className="grid gap-1.5">
        {RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <li key={rule.label} className={`flex items-center gap-2 body-xsm-regular ${met ? "text-green" : "text-primary-300"}`}>
              <span className={`flex h-4 w-4 items-center justify-center rounded-full ${met ? "bg-green-bg" : "border border-dash bg-slate-50"}`}>
                {met && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
      <AuthField id="invite-confirm" label="Confirm password" icon={Lock} revealable placeholder="••••••••" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      <AuthSubmitButton isSubmitting={isSubmitting} submittingText="Joining the team...">
        Accept invitation
      </AuthSubmitButton>
    </form>
  );
}

export default AcceptInviteForm;
