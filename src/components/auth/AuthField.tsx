"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

export interface AuthFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  /** Adds a show / hide toggle for password inputs. */
  revealable?: boolean;
}

/** Labelled auth-page input with a leading icon, optional password reveal and an error line (react-hook-form ready). */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField({ id, label, icon: Icon, error, revealable, type, ...input }, ref) {
  const [show, setShow] = useState(false);
  const inputType = revealable ? (show ? "text" : "password") : type;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block body-sm-medium text-primary-500 tracking-tight">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
          <Icon className="h-5 w-5" />
        </span>
        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          className={`w-full h-13 sm:h-13.5 pl-12 ${revealable ? "pr-12" : "pr-4"} rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:ring-4 transition-all ${
            error ? "border-red focus:border-red focus:ring-red/10" : "border-dash focus:border-brand-orange focus:ring-brand-orange/10"
          }`}
          {...input}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-300 hover:text-primary-500"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="body-xsm-regular text-red">{error}</p>}
    </div>
  );
});

export default AuthField;
