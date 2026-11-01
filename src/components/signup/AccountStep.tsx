"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { SignupPasswordChecklist } from "./SignupPasswordChecklist";
import type { SignupDraft } from "./signupSteps";

/** Step 1 — owner's name, work email and password. */
export function AccountStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SignupDraft>();
  const password = useWatch({ control, name: "password" }) ?? "";
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-4">
      <InputField
        id="signup-name"
        label="Full name"
        required
        autoComplete="name"
        placeholder="e.g. Nusrat Jahan"
        leftElement={<User className="h-4 w-4" />}
        error={errors.name?.message}
        aria-invalid={!!errors.name}
        {...register("name")}
      />
      <InputField
        id="signup-email"
        label="Work email"
        required
        type="email"
        autoComplete="email"
        placeholder="you@yourschool.com"
        leftElement={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        aria-invalid={!!errors.email}
        {...register("email")}
      />
      <div>
        <InputField
          id="signup-password"
          label="Password"
          required
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a password"
          leftElement={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="cursor-pointer p-0.5 text-primary-300 transition-colors hover:text-brand-orange"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <SignupPasswordChecklist password={password} />
      </div>
    </div>
  );
}

export default AccountStep;
