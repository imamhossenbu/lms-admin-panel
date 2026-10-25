"use client";

import React from "react";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";

const PASSWORD_RULES = [
  "12+ characters",
  "Mix of letters, numbers & symbols",
  "Sent to instructor's email",
];

const COPY = {
  create: {
    title: "A secure password will be automatically generated.",
    description: "The instructor will receive this password via email after the account is created.",
  },
  edit: {
    title: "The instructor's current password stays unchanged.",
    description: "Updating details here won't reset their password. New passwords are always generated securely and emailed.",
  },
};

interface InstructorPasswordCardProps {
  mode?: "create" | "edit";
}

export function InstructorPasswordCard({ mode = "create" }: InstructorPasswordCardProps) {
  const copy = COPY[mode];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs text-left">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <h2 className="title-medium font-bold text-primary-500 leading-10">
            Password
          </h2>

          <div className="bg-green-bg border border-green/30 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-green shrink-0 mt-0.5" />
              <div>
                <h3 className="body-medium font-bold text-primary-500">{copy.title}</h3>
                <p className="body-sm-regular text-primary-400 mt-0.5">{copy.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-8">
              {PASSWORD_RULES.map((rule) => (
                <div key={rule} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                  <span className="body-xsm-medium text-primary-400">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorPasswordCard;
