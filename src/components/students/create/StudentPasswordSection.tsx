"use client";

import React from "react";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";

export function StudentPasswordSection() {
  return (
    <div className="space-y-3 pt-2">
      {/* Subsection Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <h3 className="title-medium font-bold text-primary-500">Password</h3>
      </div>

      {/* Generated Password Info Box */}
      <div className="bg-green-bg border border-green rounded-xl p-4.5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-green border border-green flex items-center justify-center shrink-0 mt-0.5">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h4 className="body-medium font-bold text-primary-500">
              A secure password will be automatically generated.
            </h4>
            <p className="body-sm-regular text-primary-400 mt-0.5">
              The student will receive this password via email after the account is created.
            </p>
          </div>
        </div>

        {/* Feature Checkpoints */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-green/60">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span className="body-xsm-medium text-primary-500">12+ characters</span>
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span className="body-xsm-medium text-primary-500">
              Mix of letters, numbers &amp; symbols
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span className="body-xsm-medium text-primary-500">
              Sent to student&apos;s email
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
