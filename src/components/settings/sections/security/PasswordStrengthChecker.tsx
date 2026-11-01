"use client";

import React, { useId, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { InputField } from "@/components/ui/InputField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { passwordRules, passwordStrength } from "./securityUtils";

/** Aside: type a sample password and see it checked live against the policy being edited. */
export function PasswordStrengthChecker() {
  const { control } = useFormContext<SecuritySettings>();
  const [passwordMinLength, requireUppercase, requireNumber, requireSymbol] = useWatch({
    control,
    name: ["passwordMinLength", "requireUppercase", "requireNumber", "requireSymbol"],
  });
  const [sample, setSample] = useState("");
  const [visible, setVisible] = useState(false);
  const id = useId();

  const rules = passwordRules(sample, { passwordMinLength, requireUppercase, requireNumber, requireSymbol });
  const strength = passwordStrength(sample, rules);

  return (
    <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="dashboard-card shadow-2xs p-5">
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
          <KeyRound className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <h3 className="body-sm-medium font-semibold! text-primary-500">Try your policy</h3>
          <p className="body-xsm-regular text-primary-300">Type a sample password — nothing is saved.</p>
        </div>
      </header>

      <div className="mt-4">
        <InputField
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="off"
          placeholder="e.g. Sunrise#2026"
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          aria-label="Sample password"
          rightElement={
            <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"} className="cursor-pointer text-primary-300 hover:text-primary-500">
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden>
          {[1, 2, 3, 4].map((seg) => (
            <div key={seg} className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={cn("h-full rounded-full", strength.barClass)}
                initial={false}
                animate={{ width: strength.level >= seg ? "100%" : "0%" }}
                transition={{ duration: 0.25, ease: "easeOut", delay: (seg - 1) * 0.04 }}
              />
            </div>
          ))}
        </div>
        <ToneBadge tone={strength.tone} size="sm" variant="pill">
          {strength.label}
        </ToneBadge>
      </div>

      <ul className="mt-4 space-y-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {rules.map((rule) => {
            const state = !sample ? "idle" : rule.met ? "ok" : "fail";
            return (
              <motion.li
                key={rule.key}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2.5"
              >
                <motion.span
                  key={state}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    state === "ok" && "bg-green-bg text-green",
                    state === "fail" && "bg-red-14 text-red",
                    state === "idle" && "bg-slate-100 text-primary-300"
                  )}
                >
                  {state === "fail" ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                </motion.span>
                <span className={cn("body-xsm-medium", state === "ok" ? "text-primary-500" : state === "fail" ? "text-red" : "text-primary-300")}>{rule.label}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.section>
  );
}

export default PasswordStrengthChecker;
