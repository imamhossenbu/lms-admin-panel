"use client";

import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface AuthAlertBannerProps {
  message: string | null;
  title?: string;
  type?: "error" | "success" | "warning";
  onClose?: () => void;
  className?: string;
}

export function AuthAlertBanner({
  message,
  title,
  type = "error",
  onClose,
  className = "",
}: AuthAlertBannerProps) {
  if (!message) return null;

  const isError = type === "error";
  const defaultTitle = isError ? "Action Required" : "Notice";

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-start gap-2.5 mb-5 text-left animate-in fade-in duration-200 ${
        isError
          ? "bg-[#df1c4114] border-[#df1c41]/30"
          : "bg-green-bg border-green/30"
      } ${className}`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
      )}
      <div className="flex-1 space-y-0.5">
        <p
          className={`body-xsm-medium font-semibold ${
            isError ? "text-red-dark" : "text-green"
          }`}
        >
          {title || defaultTitle}
        </p>
        <p
          className={`body-xsm-regular leading-relaxed ${
            isError ? "text-red" : "text-green"
          }`}
        >
          {message}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-primary-300 hover:text-primary-500 p-0.5 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
