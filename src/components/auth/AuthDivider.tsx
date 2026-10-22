import React from "react";

interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "or", className = "my-6" }: AuthDividerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dash" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 body-xsm-regular subtext-500">{text}</span>
      </div>
    </div>
  );
}
