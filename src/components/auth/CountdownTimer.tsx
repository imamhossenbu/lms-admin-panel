"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  initialSeconds?: number;
  onResend: () => Promise<void> | void;
  isResending?: boolean;
  className?: string;
}

export function CountdownTimer({
  initialSeconds = 298,
  onResend,
  isResending = false,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendClick = async () => {
    await onResend();
    setTimeLeft(initialSeconds);
  };

  return (
    <div className={`flex items-center justify-between pt-0.5 ${className}`}>
      <div className="flex items-center gap-1.5 body-sm-regular subtext-500">
        <Clock className="w-4 h-4 text-primary-300" />
        <span>
          Code will expire in{" "}
          <span className="body-sm-medium text-brand-orange">
            {formatTime(timeLeft)}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleResendClick}
        disabled={isResending}
        className="body-sm-medium text-brand-orange text-brand-orange-hover:hover transition-colors cursor-pointer disabled:opacity-50"
      >
        {isResending ? "Sending..." : "Resend Code"}
      </button>
    </div>
  );
}
