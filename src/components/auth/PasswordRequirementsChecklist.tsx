"use client";

import React from "react";
import { Check } from "lucide-react";

interface PasswordRequirementsChecklistProps {
  password: string;
  className?: string;
}

export function PasswordRequirementsChecklist({
  password = "",
  className = "",
}: PasswordRequirementsChecklistProps) {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const requirements = [
    { label: "At least 8 characters", valid: hasMinLength },
    { label: "Include a number", valid: hasNumber },
    { label: "Include a special character (e.g. !@#$%)", valid: hasSpecialChar },
    { label: "Include both uppercase and lowercase letters", valid: hasUpperAndLower },
  ];

  return (
    <div className={`space-y-2.5 pt-0.5 pb-1 ${className}`}>
      {requirements.map((req, idx) => (
        <div key={idx} className="flex items-center gap-2.5 transition-colors">
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
              req.valid
                ? "bg-green text-white shadow-2xs scale-105"
                : "border border-dash bg-slate-50 text-primary-300"
            }`}
          >
            <Check
              className={`w-2.5 h-2.5 ${req.valid ? "stroke-[3]" : "stroke-[2.5]"}`}
            />
          </span>
          <span
            className={`transition-colors duration-150 body-sm-regular ${
              req.valid ? "text-primary-400 font-medium" : "subtext-500"
            }`}
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}
