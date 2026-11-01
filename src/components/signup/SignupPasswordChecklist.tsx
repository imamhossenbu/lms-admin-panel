"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Live checklist mirroring signupSchema's password rules. */
export function SignupPasswordChecklist({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "At least one letter", ok: /[A-Za-z]/.test(password) },
    { label: "At least one number", ok: /[0-9]/.test(password) },
  ];
  return (
    <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3" aria-label="Password requirements">
      {rules.map((r) => (
        <li key={r.label} className="flex items-center gap-2">
          <motion.span
            initial={false}
            animate={{ scale: r.ok ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
              r.ok ? "bg-green text-white" : "border border-dash bg-slate-50 text-primary-300"
            )}
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </motion.span>
          <span className={cn("body-xsm-regular", r.ok ? "text-primary-400" : "text-primary-300")}>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default SignupPasswordChecklist;
