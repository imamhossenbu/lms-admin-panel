import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthBackButtonProps {
  href?: string;
  label?: string;
  variant?: "button" | "link";
  className?: string;
}

export function AuthBackButton({
  href = "/login",
  label = "Back to Sign In",
  variant = "button",
  className = "",
}: AuthBackButtonProps) {
  if (variant === "link") {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 body-sm-medium text-muted text-brand-orange-hover:hover transition-colors ${className}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`w-full h-[50px] sm:h-[52px] rounded-xl border border-dash hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 body-medium font-semibold text-primary-400 cursor-pointer shadow-2xs active:scale-[0.99] ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-primary-300" />
      <span>{label}</span>
    </Link>
  );
}
