import React, { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

interface QuickDemoAccessBarProps {
  onFillDemo: () => void;
  email?: string;
  password?: string;
}

export function QuickDemoAccessBar({
  onFillDemo,
  email = "admin@lms.com",
  password = "admin123",
}: QuickDemoAccessBarProps) {
  const [copied, setCopied] = useState(false);

  const handleFill = () => {
    onFillDemo();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.info("Demo credentials loaded", {
      description: `${email} • ${password}`,
      icon: <Sparkles className="w-4 h-4 text-brand-orange" />,
    });
  };

  return (
    <div className="mb-5 p-3 rounded-xl bg-brand-orange-light border border-brand-orange/20 flex items-center justify-between gap-3 text-left">
      <div className="min-w-0">
        <span className="body-xsm-medium font-bold text-brand-orange uppercase tracking-wider block">
          Quick Demo Access
        </span>
        <span className="body-xsm-regular font-mono text-primary-400 truncate block">
          {email} • {password}
        </span>
      </div>
      <button
        type="button"
        onClick={handleFill}
        className="px-2.5 py-1 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white body-xsm-medium font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Loaded</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Fill</span>
          </>
        )}
      </button>
    </div>
  );
}
