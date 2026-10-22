"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
  submittingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
  className?: string;
  showArrow?: boolean;
}

export function AuthSubmitButton({
  children,
  isSubmitting = false,
  submittingText = "Processing...",
  disabled = false,
  onClick,
  type = "submit",
  className = "",
  showArrow = true,
}: AuthSubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isSubmitting}
      onClick={onClick}
      className={`group w-full h-[52px] sm:h-[54px] rounded-xl bg-brand-orange bg-brand-orange:hover active:scale-[0.99] text-white body-medium font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed edupro-glow-btn ${className}`}
    >
      {isSubmitting ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>{submittingText}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          )}
        </>
      )}
    </button>
  );
}
